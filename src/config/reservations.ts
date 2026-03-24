export interface TableConfig {
    id: string;
    capacity: number;
}

export interface ReservationStoreConfig {
    storeId: string;
    tables: TableConfig[];
    slotIntervalMinutes: number;
    defaultDurationMinutes: number;
    minAdvanceBookingHours: number;
    maxModificationHours: number;
}

const DEFAULT_TABLES: TableConfig[] = [
    { id: 'T1', capacity: 2 },
    { id: 'T2', capacity: 2 },
    { id: 'T3', capacity: 2 },
    { id: 'T4', capacity: 2 },
    { id: 'T5', capacity: 2 },
    { id: 'T6', capacity: 4 },
    { id: 'T7', capacity: 4 },
    { id: 'T8', capacity: 4 },
    { id: 'T9', capacity: 6 },
    { id: 'T10', capacity: 6 },
];

export const RESERVATION_CONFIG: Record<string, ReservationStoreConfig> = {
    judengasse: {
        storeId: 'judengasse',
        tables: DEFAULT_TABLES,
        slotIntervalMinutes: 15,
        defaultDurationMinutes: 60,
        minAdvanceBookingHours: 1,
        maxModificationHours: 2,
    },
    schottengasse: {
        storeId: 'schottengasse',
        tables: DEFAULT_TABLES,
        slotIntervalMinutes: 15,
        defaultDurationMinutes: 60,
        minAdvanceBookingHours: 1,
        maxModificationHours: 2,
    },
    wipplingerstrasse: {
        storeId: 'wipplingerstrasse',
        tables: DEFAULT_TABLES,
        slotIntervalMinutes: 15,
        defaultDurationMinutes: 60,
        minAdvanceBookingHours: 1,
        maxModificationHours: 2,
    },
    vorgarten: {
        storeId: 'vorgarten',
        tables: DEFAULT_TABLES,
        slotIntervalMinutes: 15,
        defaultDurationMinutes: 60,
        minAdvanceBookingHours: 1,
        maxModificationHours: 2,
    },
    esterhazygasse: {
        storeId: 'esterhazygasse',
        tables: DEFAULT_TABLES,
        slotIntervalMinutes: 15,
        defaultDurationMinutes: 60,
        minAdvanceBookingHours: 1,
        maxModificationHours: 2,
    },
};
