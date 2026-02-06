import express from 'express';
import { INotificationRepository } from '../infrastructure/repositories/INotificationRepository';
import {
  EventSourceMismatchError,
  NotificationNotFoundError,
  UserNotFoundError,
} from '../domain/errors';
import { LocationEvent } from '../domain/LocationEvent';

interface ApplicationParameters {
  notificationRepository: INotificationRepository;
}

export function createApp(
  parameters: ApplicationParameters,
): express.Application {
  const app = express();
  app.use(express.json());

  app.get('/notifications', async (_req, res) => {
    const notifications = await parameters.notificationRepository.list();
    const notificationsJson = notifications.map((notification) =>
      notification.toJSON(),
    );
    res.json({ notifications: notificationsJson });
  });

  app.post(
    '/notifications/:notificationId/confirm-for-user',
    async (req, res) => {
      try {
        const { notificationId } = req.params;
        const { userId } = req.body;

        if (!userId) {
          res.status(400).json({ error: 'userId is required' });
          return;
        }

        const notification = await parameters.notificationRepository.get(
          notificationId,
        );

        const userConfirmation = notification.confirmForUser({ userId });

        await parameters.notificationRepository.update(notification);

        res.json({
          userConfirmation: {
            confirmedAt: userConfirmation.confirmedAt.toISOString(),
            confirmedBy: userConfirmation.confirmedBy,
          },
        });
      } catch (error) {
        if (error instanceof NotificationNotFoundError) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error instanceof UserNotFoundError) {
          res.status(400).json({ error: error.message });
          return;
        }
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  );

  app.post(
    '/notifications/:notificationId/confirm-for-event',
    async (req, res) => {
      try {
        const { notificationId } = req.params;
        const { event } = req.body;

        if (!event) {
          res.status(400).json({ error: 'event is required' });
          return;
        }

        if (!event.source || event.timestamp === undefined) {
          res.status(400).json({
            error: 'event must have source and timestamp',
          });
          return;
        }

        const notification = await parameters.notificationRepository.get(
          notificationId,
        );

        const confirmingEvent = new LocationEvent(
          event.source,
          event.timestamp,
        );

        const autoConfirmation = notification.confirmForEvent(confirmingEvent);

        await parameters.notificationRepository.update(notification);

        res.json({
          autoConfirmation: {
            confirmedAt: autoConfirmation.confirmedAt.toISOString(),
            confirmedBy: {
              source: autoConfirmation.confirmedBy.source,
              timestamp: autoConfirmation.confirmedBy.timestamp,
            },
          },
        });
      } catch (error) {
        if (error instanceof NotificationNotFoundError) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error instanceof EventSourceMismatchError) {
          res.status(400).json({ error: error.message });
          return;
        }
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  );

  return app;
}
