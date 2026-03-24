// Copy and adapt.
// Suggested target: src/features/reservations/server/channels.ts

import type { ReservationEvent } from "./types";

export interface ReservationChannel {
  name: string;
  publish(event: ReservationEvent): Promise<void>;
}

export class NoopReservationChannel implements ReservationChannel {
  name = "noop";

  async publish(event: ReservationEvent): Promise<void> {
    console.info("[reservation-event]", event.type, event.audience, event.payload);
  }
}

export async function emitReservationEvents(params: {
  channels: ReservationChannel[];
  events: ReservationEvent[];
}) {
  await Promise.all(
    params.events.flatMap((event) =>
      params.channels.map(async (channel) => {
        try {
          await channel.publish(event);
        } catch (error) {
          console.error(
            `[reservation-channel:${channel.name}] failed to publish`,
            error,
          );
        }
      }),
    ),
  );
}

// Keep channels modular.
// Route handlers and UI should call domain services,
// and domain services should emit typed events through this adapter layer.
// Future adapters can target:
// - webhooks
// - email
// - SMS
// - internal notifications
