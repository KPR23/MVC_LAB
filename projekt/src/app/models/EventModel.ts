import { Queries } from '@/src/server/db/queries';

export class EventModel {
  static async getAllEvents() {
    return Queries.getEvents();
  }
  static async getEventBySlug(category: string, title: string) {
    const events = await Queries.getEvents();
    return events.find(
      (e) =>
        e.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category &&
        e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === title
    );
  }
}
