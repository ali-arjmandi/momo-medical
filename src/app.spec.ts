import request from 'supertest';
import { createApp } from './app';
import { Bed } from './Bed';
import { InMemoryNotificationRepository } from './InMemoryNotificationRepository';
import { LocationEvent } from './LocationEvent';
import { Notification } from './Notification';
import { Organisation } from './Organisation';
import { User } from './User';
import { UserDevice } from './UserDevice';

describe('app', () => {
  const testOrganisation = new Organisation('organisation-1', true);
  const testBed = new Bed('bed-1', 'Bed 1', 'Ward 1', true);
  const testUserDevice = new UserDevice(true);
  const testUser = new User('user-1', ['Ward 1'], [testUserDevice]);
  const testEvent = new LocationEvent(
    'wall-button-20',
    new Date(2025, 4, 6).valueOf(),
  );

  const signalSender = {
    sendSignal: jest.fn(),
  };

  const publisher = {
    publish: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  describe('GET /notifications', () => {
    it('should return all notifications', async () => {
      const testNotification = new Notification({
        id: '1',
        organisation: testOrganisation,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const app = createApp({
        notificationRepository: new InMemoryNotificationRepository([
          testNotification,
        ]),
      });

      await request(app)
        .get('/notifications')
        .expect(
          200,
          JSON.stringify({
            notifications: [testNotification],
          }),
        );
    });
  });

  describe('POST /notifications/:notificationId/confirm-for-user', () => {
    it('should confirm a Notification and receive a UserConfirmation', async () => {
      const testNotification = new Notification({
        id: '1',
        organisation: testOrganisation,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const app = createApp({
        notificationRepository: new InMemoryNotificationRepository([
          testNotification,
        ]),
      });

      await request(app)
        .post(`/notifications/${testNotification.id}/confirm-for-user`)
        .send({ userId: testUser.id })
        .expect(
          200,
          JSON.stringify({
            userConfirmation: {
              confirmedAt: new Date().toISOString(),
              confirmedBy: testUser,
            },
          }),
        );
    });
  });

  describe('POST /notifications/:notificationId/confirm-for-event', () => {
    it('should confirm a Notification and receive an AutoConfirmation', async () => {
      const testNotification = new Notification({
        id: '1',
        organisation: testOrganisation,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const app = createApp({
        notificationRepository: new InMemoryNotificationRepository([
          testNotification,
        ]),
      });

      const confirmingEvent = {
        source: 'wall-button-20',
        timestamp: new Date().valueOf(),
      };

      await request(app)
        .post(`/notifications/${testNotification.id}/confirm-for-event`)
        .send({
          event: confirmingEvent,
        })
        .expect(
          200,
          JSON.stringify({
            autoConfirmation: {
              confirmedAt: new Date().toISOString(),
              confirmedBy: confirmingEvent,
            },
          }),
        );
    });
  });
});
