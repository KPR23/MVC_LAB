import { EventModel } from '@/src/models/EventModel';
import { Mutations } from '@/src/server/db/queries';

export class EventController {
  static async getAllEvents() {
    const eventModels = await EventModel.getAllEvents();
    return eventModels.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      organizer: event.organizer,
      category: event.category,
      city: event.city,
      location: event.location,
      imageUrl: event.imageUrl,
      dateFrom: event.dateFrom,
      dateTo: event.dateTo,
      time: event.time,
      capacity: event.capacity,
      availableSeats: event.availableSeats,
      price: event.price,
      createdAt: event.createdAt,
      artistsData: event.artistsData,
    }));
  }

  static async getEventBySlug(category: string, title: string) {
    const eventModel = await EventModel.getEventBySlug(category, title);
    if (!eventModel) return null;

    return {
      id: eventModel.id,
      title: eventModel.title,
      description: eventModel.description,
      organizer: eventModel.organizer,
      category: eventModel.category,
      city: eventModel.city,
      location: eventModel.location,
      imageUrl: eventModel.imageUrl,
      dateFrom: eventModel.dateFrom,
      dateTo: eventModel.dateTo,
      time: eventModel.time,
      capacity: eventModel.capacity,
      availableSeats: eventModel.availableSeats,
      price: eventModel.price,
      createdAt: eventModel.createdAt,
      artistsData: eventModel.artistsData,
    };
  }

  static async createEvent(eventData: {
    title: string;
    description: string;
    artists: Array<{ id: string; name: string }>;
    organizer: string;
    category: string;
    city: string;
    location: string;
    imageUrl: string;
    dateFrom: string;
    dateTo: string;
    time: string;
    capacity: number;
    availableSeats: number;
    price: number;
  }) {
    try {
      const result = await Mutations.createEvent({ event: eventData });
      return { success: true, eventId: result.eventId };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async updateEvent(eventData: {
    id: string;
    title: string;
    description: string;
    artists: Array<{ id?: string; name: string }>;
    organizer: string;
    category: string;
    city: string;
    location: string;
    imageUrl: string;
    dateFrom: string;
    dateTo: string;
    time: string;
    capacity: number;
    availableSeats: number;
    price: number;
  }) {
    try {
      await Mutations.updateEvent({ event: eventData });
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async deleteEvent(eventId: string) {
    try {
      await Mutations.deleteEvent({ event: { id: eventId } });
      return { success: true };
    } catch (error) {
      console.error('Error in EventController.deleteEvent:', error);
      const errorMessage = (error as Error).message;
      if (
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('violates foreign key') ||
        errorMessage.includes('referenced from table')
      ) {
        return {
          success: false,
          error:
            'Nie można usunąć wydarzenia, które ma dokonane rezerwacje. Najpierw usuń wszystkie rezerwacje.',
        };
      }
      return { success: false, error: errorMessage };
    }
  }
}
