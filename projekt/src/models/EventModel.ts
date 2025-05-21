import { Queries } from '@/src/server/db/queries';
import type { DB_EventType } from '@/src/server/db/schema';

export class EventModel {
  id: string;
  title: string;
  description: string;
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
  createdAt: Date;
  artistsData?: Array<{ id: string; name: string }>;

  constructor(eventData: DB_EventType) {
    this.id = eventData.id;
    this.title = eventData.title;
    this.description = eventData.description;
    this.organizer = eventData.organizer;
    this.category = eventData.category;
    this.city = eventData.city;
    this.location = eventData.location;
    this.imageUrl = eventData.imageUrl;
    this.dateFrom = eventData.dateFrom;
    this.dateTo = eventData.dateTo;
    this.time = eventData.time;
    this.capacity = eventData.capacity;
    this.availableSeats = eventData.availableSeats;
    this.price = eventData.price;
    this.createdAt = eventData.createdAt;
  }

  static async getAllEvents() {
    const events = await Queries.getEvents();

    const eventsWithArtists = await Promise.all(
      events.map(async (event) => {
        const eventArtists = await Queries.getArtistsByEventId(event.id);
        const eventModel = new EventModel(event);
        eventModel.artistsData = eventArtists;
        return eventModel;
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

    const eventModel = new EventModel(event);
    eventModel.artistsData = await Queries.getArtistsByEventId(event.id);

    return eventModel;
  }

  getSlug() {
    const categorySlug = this.category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const titleSlug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { category: categorySlug, title: titleSlug };
  }

  static fromPlainObject(obj: any): EventModel {
    const eventData = {
      id: obj.id,
      title: obj.title,
      description: obj.description,
      organizer: obj.organizer,
      category: obj.category,
      city: obj.city,
      location: obj.location,
      imageUrl: obj.imageUrl,
      dateFrom: obj.dateFrom,
      dateTo: obj.dateTo,
      time: obj.time,
      capacity: obj.capacity,
      availableSeats: obj.availableSeats,
      price: obj.price,
      createdAt: obj.createdAt,
    } as DB_EventType;

    const model = new EventModel(eventData);
    if (obj.artistsData) {
      model.artistsData = obj.artistsData;
    }
    return model;
  }
}
