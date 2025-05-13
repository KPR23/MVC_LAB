import { Queries } from '@/src/server/db/queries';

export class EventModel {
  static async getAllEvents() {
    const events = await Queries.getEvents();

    const eventsWithArtists = await Promise.all(
      events.map(async (event) => {
        const eventArtists = await Queries.getArtistsByEventId(event.id);
        return {
          ...event,
          artistsData: eventArtists,
        };
      })
    );

    return eventsWithArtists;
  }

  static async getEventBySlug(category: string, title: string) {
    const events = await Queries.getEvents();
    const event = events.find(
      (e) =>
        e.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category &&
        e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === title
    );

    if (!event) return null;

    const eventArtists = await Queries.getArtistsByEventId(event.id);

    return {
      ...event,
      artistsData: eventArtists,
    };
  }
}
