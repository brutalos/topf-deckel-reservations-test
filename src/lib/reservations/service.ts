import { prisma } from '../prisma';
import { RESERVATION_CONFIG, TableConfig } from '@/config/reservations';
import { stores } from '@/config/stores';
import { ReservationStatus, ReservationAction } from './types';
import { emitReservationEvent } from './events';
import { 
    addMinutes, 
    parse, 
    format, 
    addHours, 
    isBefore, 
    parseISO, 
} from 'date-fns';
import { randomUUID } from 'crypto';

/**
 * Reservation Domain Service
 * Handles business logic for bookings, availability, and status management.
 */
export class ReservationService {

    /**
     * Finds available time slots for a store on a given date and party size.
     */
    static async checkAvailability(storeId: string, partySize: number, reservationDate: string) {
        if (!prisma) {
            throw new Error('Database client not initialized');
        }

        const store = stores.find(s => s.id === storeId);
        const config = RESERVATION_CONFIG[storeId];
        if (!store || !config) return [];

        const slots: string[] = [];
        const openTime = store.openTime; // e.g., 11
        const closeTime = store.closeTime; // e.g., 15

        const dayStart = parse(reservationDate, 'yyyy-MM-dd', new Date());
        let currentSlot = addHours(dayStart, openTime);
        const endOfBookableDay = addHours(dayStart, closeTime - (config.defaultDurationMinutes / 60));

        const now = new Date();
        const minLeadTime = addHours(now, config.minAdvanceBookingHours);

        while (isBefore(currentSlot, endOfBookableDay) || currentSlot.getTime() === endOfBookableDay.getTime()) {
            const timeStr = format(currentSlot, 'HH:mm');
            
            if (isBefore(currentSlot, minLeadTime)) {
                currentSlot = addMinutes(currentSlot, config.slotIntervalMinutes);
                continue;
            }

            const availableTables = await this.findAvailableTable(storeId, partySize, reservationDate, timeStr);
            
            if (availableTables) {
                slots.push(timeStr);
            }
            currentSlot = addMinutes(currentSlot, config.slotIntervalMinutes);
        }

        return slots;
    }

    /**
     * Internal helper to find a table or combination of tables for a slot.
     */
    private static async findAvailableTable(storeId: string, partySize: number, date: string, time: string) {
        if (!prisma) {
            throw new Error('Database client not initialized');
        }

        const config = RESERVATION_CONFIG[storeId];
        const duration = config.defaultDurationMinutes;
        const slotsNeeded = duration / 15;

        const startDT = `${date}T${time}:00`;
        const slotStrings: string[] = [];
        let dt = parseISO(startDT);
        for (let i = 0; i < slotsNeeded; i++) {
            slotStrings.push(format(dt, "yyyy-MM-dd'T'HH:mm:ss"));
            dt = addMinutes(dt, 15);
        }

        const occupied = await (prisma as any).reservationTableAssignment.findMany({
            where: {
                reservation: { storeId },
                slotDateTime: { in: slotStrings }
            },
            select: { tableId: true }
        });
        
        const occupiedBlocks = await (prisma as any).reservationBlock.findMany({
            where: {
                storeId,
                slotDateTime: { in: slotStrings }
            },
            select: { tableId: true }
        });

        if (occupiedBlocks.some((b: any) => !b.tableId)) {
            return null;
        }

        const occupiedSet = new Set([
            ...occupied.map((o: any) => o.tableId),
            ...occupiedBlocks.filter((b: any) => b.tableId).map((b: any) => b.tableId!)
        ]);

        const availableTables = config.tables
            .filter(t => !occupiedSet.has(t.id))
            .sort((a, b) => a.capacity - b.capacity);

        const singleTable = availableTables.find(t => t.capacity >= partySize);
        if (singleTable) return [singleTable.id];

        let combinedCapacity = 0;
        const assignedTables: string[] = [];
        const sortedAvailable = [...availableTables].sort((a, b) => b.capacity - a.capacity);
        
        for (const table of sortedAvailable) {
            assignedTables.push(table.id);
            combinedCapacity += table.capacity;
            if (combinedCapacity >= partySize) {
                return assignedTables;
            }
        }

        return null;
    }

    /**
     * Creates a new reservation and table assignments in a single transaction.
     */
    static async createReservation(data: {
        storeId: string;
        guestName: string;
        guestEmail: string;
        guestPhone: string;
        partySize: number;
        reservationDate: string;
        startTime: string;
        notes?: string;
    }) {
        if (!prisma) throw new Error('Database client not initialized');

        const config = RESERVATION_CONFIG[data.storeId];
        const tableIds = await this.findAvailableTable(
            data.storeId, 
            data.partySize, 
            data.reservationDate, 
            data.startTime
        );

        if (!tableIds) {
            throw new Error('SLOT_NO_LONGER_AVAILABLE');
        }

        const id = randomUUID();
        const editToken = randomUUID();
        const now = new Date().toISOString();
        const duration = config.defaultDurationMinutes;
        const slotsNeeded = duration / 15;

        return await prisma.$transaction(async (tx) => {
            const reservation = await (tx as any).reservation.create({
                data: {
                    id,
                    storeId: data.storeId,
                    guestName: data.guestName,
                    guestEmail: data.guestEmail,
                    guestPhone: data.guestPhone,
                    partySize: data.partySize,
                    reservationDate: data.reservationDate,
                    startTime: data.startTime,
                    status: 'CONFIRMED',
                    notes: data.notes,
                    editToken,
                    createdAt: now,
                    updatedAt: now,
                }
            });

            // Create 15-minute slot records for each assigned table
            const assignments = [];
            let currentDT = parseISO(`${data.reservationDate}T${data.startTime}:00`);
            
            for (let i = 0; i < slotsNeeded; i++) {
                const slotStr = format(currentDT, "yyyy-MM-dd'T'HH:mm:ss");
                for (const tableId of tableIds) {
                    assignments.push({
                        id: randomUUID(),
                        reservationId: id,
                        tableId,
                        slotDateTime: slotStr
                    });
                }
                currentDT = addMinutes(currentDT, 15);
            }

            await (tx as any).reservationTableAssignment.createMany({
                data: assignments
            });

            await (tx as any).reservationAuditLog.create({
                data: {
                    id: randomUUID(),
                    reservationId: id,
                    action: 'CREATED',
                    details: `Created reservation for party of ${data.partySize}. Tables: ${tableIds.join(', ')}`,
                    timestamp: now
                }
            });

            emitReservationEvent({ type: 'reservation.created', reservationId: id, payload: { tableIds } });

            return { ...reservation, tableIds };
        });
    }

    /**
     * Updates reservation status.
     */
    static async updateStatus(reservationId: string, status: ReservationStatus, details?: string) {
        if (!prisma) throw new Error('Database client not initialized');

        const now = new Date().toISOString();
        const reservation = await (prisma as any).reservation.update({
            where: { id: reservationId },
            data: { status, updatedAt: now }
        });

        if (status === 'CANCELLED') {
            await (prisma as any).reservationTableAssignment.deleteMany({
                where: { reservationId }
            });
        }

        await (prisma as any).reservationAuditLog.create({
            data: {
                id: randomUUID(),
                reservationId,
                action: 'STATUS_CHANGE',
                details: details || `Status changed to ${status}`,
                timestamp: now
            }
        });

        const eventMap: Record<ReservationStatus, any> = {
            CONFIRMED: 'reservation.updated',
            SEATED: 'reservation.seated',
            COMPLETED: 'reservation.completed',
            NO_SHOW: 'reservation.no_show',
            CANCELLED: 'reservation.cancelled',
            PENDING: 'reservation.updated'
        };

        emitReservationEvent({ type: eventMap[status], reservationId });

        return reservation;
    }
}
