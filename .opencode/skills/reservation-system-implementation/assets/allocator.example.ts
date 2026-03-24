// Copy and adapt.
// Suggested target: src/features/reservations/server/allocator.ts

type TableConfig = {
  id: string;
  name: string;
  areaId: string;
  minPartySize: number;
  maxPartySize: number;
  priority: number;
};

type TableCombinationConfig = {
  id: string;
  tableIds: string[];
  minPartySize: number;
  maxPartySize: number;
  priority: number;
};

type ActiveAssignment = {
  tableId: string;
  reservedFrom: Date;
  reservedUntil: Date;
  active: boolean;
};

type ActiveBlock = {
  scope: "LOCATION" | "AREA" | "TABLE";
  areaId?: string | null;
  tableId?: string | null;
  startsAt: Date;
  endsAt: Date;
  active: boolean;
};

type CandidateAssignment = {
  comboId?: string;
  tableIds: string[];
  areaId?: string;
  totalCapacityScore: number;
  priorityScore: number;
};

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function isTableBlockedByInventory(
  tableId: string,
  slotStart: Date,
  slotEnd: Date,
  assignments: ActiveAssignment[],
): boolean {
  return assignments.some(
    (item) =>
      item.active &&
      item.tableId === tableId &&
      overlaps(slotStart, slotEnd, item.reservedFrom, item.reservedUntil),
  );
}

function isTableBlockedByOperationalBlock(
  table: TableConfig,
  slotStart: Date,
  slotEnd: Date,
  blocks: ActiveBlock[],
): boolean {
  return blocks.some((block) => {
    if (!block.active) return false;
    if (!overlaps(slotStart, slotEnd, block.startsAt, block.endsAt)) return false;
    if (block.scope === "LOCATION") return true;
    if (block.scope === "AREA") return block.areaId === table.areaId;
    if (block.scope === "TABLE") return block.tableId === table.id;
    return false;
  });
}

function tableCanFitParty(table: TableConfig, partySize: number): boolean {
  return partySize >= table.minPartySize && partySize <= table.maxPartySize;
}

function comboCanFitParty(
  combo: TableCombinationConfig,
  partySize: number,
): boolean {
  return partySize >= combo.minPartySize && partySize <= combo.maxPartySize;
}

export function buildCandidateAssignments(params: {
  tables: TableConfig[];
  combinations: TableCombinationConfig[];
  assignments: ActiveAssignment[];
  blocks: ActiveBlock[];
  slotStart: Date;
  slotEnd: Date;
  partySize: number;
  areaPreference?: string;
}): CandidateAssignment[] {
  const {
    tables,
    combinations,
    assignments,
    blocks,
    slotStart,
    slotEnd,
    partySize,
    areaPreference,
  } = params;

  const freeTables = tables.filter((table) => {
    if (areaPreference && table.areaId !== areaPreference) return false;
    if (!tableCanFitParty(table, partySize)) return false;
    if (isTableBlockedByInventory(table.id, slotStart, slotEnd, assignments)) {
      return false;
    }
    if (isTableBlockedByOperationalBlock(table, slotStart, slotEnd, blocks)) {
      return false;
    }
    return true;
  });

  const atomicCandidates: CandidateAssignment[] = freeTables.map((table) => ({
    tableIds: [table.id],
    areaId: table.areaId,
    totalCapacityScore: table.maxPartySize,
    priorityScore: table.priority,
  }));

  const comboCandidates: CandidateAssignment[] = combinations
    .filter((combo) => comboCanFitParty(combo, partySize))
    .filter((combo) =>
      combo.tableIds.every((tableId) => {
        const table = tables.find((item) => item.id === tableId);
        if (!table) return false;
        if (areaPreference && table.areaId !== areaPreference) return false;
        if (isTableBlockedByInventory(table.id, slotStart, slotEnd, assignments)) {
          return false;
        }
        if (isTableBlockedByOperationalBlock(table, slotStart, slotEnd, blocks)) {
          return false;
        }
        return true;
      }),
    )
    .map((combo) => ({
      comboId: combo.id,
      tableIds: combo.tableIds,
      areaId: tables.find((item) => item.id === combo.tableIds[0])?.areaId,
      totalCapacityScore: combo.maxPartySize,
      priorityScore: combo.priority,
    }));

  return [...atomicCandidates, ...comboCandidates].sort((a, b) => {
    if (a.totalCapacityScore !== b.totalCapacityScore) {
      return a.totalCapacityScore - b.totalCapacityScore;
    }
    if (a.tableIds.length !== b.tableIds.length) {
      return a.tableIds.length - b.tableIds.length;
    }
    return a.priorityScore - b.priorityScore;
  });
}

export function pickBestAssignment(
  candidates: CandidateAssignment[],
): CandidateAssignment | null {
  return candidates.length > 0 ? candidates[0] : null;
}

// Notes:
// - This intentionally supports predefined combinations only.
// - Keep timezone conversion outside this file if the repo already has date helpers.
// - Re-run allocation inside the write transaction. Never trust a stale public availability result.
