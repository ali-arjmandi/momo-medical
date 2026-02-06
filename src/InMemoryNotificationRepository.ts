import { INotificationRepository } from './INotificationRepository';
import { Notification } from './Notification';

export class InMemoryNotificationRepository implements INotificationRepository {
  private notifications: Map<string, Notification> = new Map();

  constructor(seed: Notification[] = []) {
    seed.forEach((notification) => {
      this.notifications.set(notification.id, notification);
    });
  }

  async list(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async get(id: string): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new NotificationNotFoundError(
        `No notification found for id: ${id}`,
      );
    }

    return notification;
  }

  async create(notification: Notification): Promise<Notification> {
    this.notifications.set(notification.id, notification);

    return notification;
  }

  async update(notification: Notification): Promise<Notification> {
    if (!this.notifications.has(notification.id)) {
      throw new NotificationNotFoundError(
        `No notification found for id: ${notification.id}`,
      );
    }

    this.notifications.set(notification.id, notification);

    return notification;
  }
}
