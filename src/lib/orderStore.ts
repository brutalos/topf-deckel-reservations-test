import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface OrderItem {
    id?: string;
    name: string;
    size?: string;
    qty: number;
    price?: number;
}

export interface Order {
    id: string;
    storeId: string;
    wolt_delivery_id: string | null;
    wolt_tracking_id: string | null;
    status: string;
    order_number: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryTime: string;
    deliveryNote: string | null;
    noContact: boolean;
    amount: number;
    orderDetails: OrderItem[];
    promiseId: string;
    eta: number | null;
    eta_iso: string | null;
    pickup_eta: number | null;
    pickup_eta_iso: string | null;
    tracking_url: string | null;
    canCancel: boolean;
    stripePaymentId: string;
    scheduledDropoffTime: string | null;
    createdAt: string;
}

function mapToOrder(dbOrder: any): Order {
    return {
        ...dbOrder,
        orderDetails: JSON.parse(dbOrder.orderDetails),
    };
}

export async function nextOrderNumber(): Promise<string> {
    const meta = await prisma.meta.upsert({
        where: { id: "singleton" },
        update: { count: { increment: 1 } },
        create: { id: "singleton", count: 1000 },
    });
    if (meta.count >= 9999) {
        await prisma.meta.update({
            where: { id: "singleton" },
            data: { count: 1000 }
        });
        return "1000";
    }
    return String(meta.count);
}

export async function addOrder(order: Order): Promise<void> {
    await prisma.order.create({
        data: {
            ...order,
            orderDetails: JSON.stringify(order.orderDetails),
        }
    });
}

function getTodayStart(): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
}

export async function getAllOrders(): Promise<Order[]> {
    const orders = await prisma.order.findMany({
        where: { createdAt: { gte: getTodayStart() } },
        orderBy: { createdAt: 'desc' },
    });
    return orders.map(mapToOrder);
}

export async function getOrdersByStore(storeId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
        where: {
            storeId,
            createdAt: { gte: getTodayStart() }
        },
        orderBy: { createdAt: 'desc' },
    });
    return orders.map(mapToOrder);
}

export async function findOrderById(id: string): Promise<Order | undefined> {
    const order = await prisma.order.findFirst({
        where: {
            OR: [
                { id },
                { stripePaymentId: id }
            ]
        }
    });
    return order ? mapToOrder(order) : undefined;
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const dataToUpdate: any = { ...updates };
    if (updates.orderDetails) {
        dataToUpdate.orderDetails = JSON.stringify(updates.orderDetails);
    }

    try {
        const order = await prisma.order.update({
            where: { id },
            data: dataToUpdate
        });
        return mapToOrder(order);
    } catch {
        return null;
    }
}

/** Recalculate live ETA from absolute ISO timestamps (pure, no I/O) */
export function withFreshEta(order: Order): Order {
    const now = Date.now();
    return {
        ...order,
        eta: order.eta_iso
            ? Math.max(0, Math.round((new Date(order.eta_iso).getTime() - now) / 60000))
            : order.eta,
        pickup_eta: order.pickup_eta_iso
            ? Math.max(0, Math.round((new Date(order.pickup_eta_iso).getTime() - now) / 60000))
            : order.pickup_eta,
    };
}
