import { Notification } from '../domain';

export interface INotificationRepository {
  list(): Promise<Notification[]>;
  get(id: string): Promise<Notification>;
  create(notification: Notification): Promise<Notification>;
  update(notification: Notification): Promise<Notification>;
}
