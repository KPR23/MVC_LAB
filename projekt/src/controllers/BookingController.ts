import { EventModel } from '@/src/models/EventModel';
import { Queries } from '@/src/server/db/queries';

export class BookingController {
  static async createBooking(
    userId: string,
    eventId: string,
    stripeSessionId: string
  ) {
    try {
      await Queries.createBooking(userId, eventId, stripeSessionId);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async getUserBookings(userId: string) {
    try {
      const bookings = await Queries.getUserBookings(userId);
      return { success: true, bookings };
    } catch (error) {
      return { success: false, error: (error as Error).message, bookings: [] };
    }
  }

  static async getUserBookingsWithEventModels(userId: string) {
    try {
      const bookings = await Queries.getUserBookings(userId);
      const events = bookings.map((booking) => {
        return EventModel.fromPlainObject(booking.event);
      });
      return { success: true, events };
    } catch (error) {
      return { success: false, error: (error as Error).message, events: [] };
    }
  }
}
