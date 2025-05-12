import { EventModel } from '../app/models/EventModel';

export class EventController {
  static async listEvents() {
    return await EventModel.getAllEvents();
  }
  static async getEvent(category: string, title: string) {
    return await EventModel.getEventBySlug(category, title);
  }
}
