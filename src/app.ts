import express from 'express';
import { INotificationRepository } from './INotificationRepository';

interface ApplicationParameters {
  notificationRepository: INotificationRepository;
}

export function createApp(
  _parameters: ApplicationParameters,
): express.Application {
  const app = express();
  app.use(express.json());

  app.get('/notifications', async (_req, res) => {
    res.status(500).send('Not implemented');
  });

  app.post(
    '/notifications/:notificationId/confirm-for-user',
    async (_req, res) => {
      res.status(500).send('Not implemented');
    },
  );

  app.post(
    '/notifications/:notificationId/confirm-for-event',
    async (_req, res) => {
      res.status(500).send('Not implemented');
    },
  );

  return app;
}
