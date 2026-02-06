import { AutoConfirmation } from './AutoConfirmation';
import { Bed } from './Bed';
import { LocationEvent } from './LocationEvent';
import { Notification } from './Notification';
import { Organization } from './Organization';
import { User } from './User';
import { UserConfirmation } from './UserConfirmation';
import { UserDevice } from './UserDevice';
import { EventSourceMismatchError, UserNotFoundError } from './errors';

describe('Notification', () => {
  const testOrganization = new Organization('organization-1', true);
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
  });

  it('should instantiate a Notification', () => {
    const id = 'notification-1';
    const testNotification = new Notification({
      id,
      organization: testOrganization,
      bed: testBed,
      users: [testUser],
      event: testEvent,
      signalSender,
      publisher,
    });

    expect(testNotification).toBeInstanceOf(Notification);
    expect(testNotification.id).toEqual(id);
    expect(testNotification.bed).toEqual(testBed);
    expect(testNotification.organization).toEqual(testOrganization);
    expect(testNotification.users).toEqual([testUser]);
    expect(testNotification.event).toEqual(testEvent);
  });

  describe('toJSON', () => {
    it('should convert a Notification to a correct JSON representation', () => {
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const json = testNotification.toJSON();

      expect(json).toEqual({
        id: 'notification-1',
        bed: testBed,
        organization: testOrganization,
        users: [testUser],
        event: testEvent,
      });
      expect(json.userConfirmation).toBeUndefined();
      expect(json.autoConfirmation).toBeUndefined();
    });

    it('should include userConfirmation when present', () => {
      const confirmedAt = new Date('2025-05-06T10:00:00Z');
      const userConfirmation = new UserConfirmation(confirmedAt, testUser);

      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
        userConfirmation,
      });

      const json = testNotification.toJSON();

      expect(json.userConfirmation).toEqual({
        confirmedAt: confirmedAt.toISOString(),
        confirmedBy: testUser,
      });
    });

    it('should include autoConfirmation when present', () => {
      const confirmedAt = new Date('2025-05-06T10:00:00Z');
      const autoConfirmation = new AutoConfirmation(confirmedAt, testEvent);

      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
        autoConfirmation,
      });

      const json = testNotification.toJSON();

      expect(json.autoConfirmation).toEqual({
        confirmedAt: confirmedAt.toISOString(),
        confirmedBy: testEvent,
      });
    });
  });

  describe('sendSignals', () => {
    it('should send signals for all UserDevices', async () => {
      const device1 = new UserDevice(true);
      const device2 = new UserDevice(true);
      const device3 = new UserDevice(true);
      const user1 = new User('user-1', ['Ward 1'], [device1, device2]);
      const user2 = new User('user-2', ['Ward 1'], [device3]);

      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [user1, user2],
        event: testEvent,
        signalSender,
        publisher,
      });

      await testNotification.sendSignals();

      expect(signalSender.sendSignal).toHaveBeenCalledTimes(1);
      expect(signalSender.sendSignal).toHaveBeenCalledWith(
        `Notification for bed ${testBed.name} in ${testBed.ward}`,
        [device1, device2, device3],
      );
    });

    it('should send no signals when the Organization has notifications disabled', async () => {
      const disabledOrganization = new Organization('organization-1', false);
      const testNotification = new Notification({
        id: 'notification-1',
        organization: disabledOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      await testNotification.sendSignals();

      expect(signalSender.sendSignal).not.toHaveBeenCalled();
    });

    it('should send no signals when notifications are turned off for the Bed', async () => {
      const disabledBed = new Bed('bed-1', 'Bed 1', 'Ward 1', false);
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: disabledBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      await testNotification.sendSignals();

      expect(signalSender.sendSignal).not.toHaveBeenCalled();
    });

    it('should send no signals when a User has disabled the ward', async () => {
      const userWithDisabledWard = new User('user-1', ['Ward 2'], [testUserDevice]);
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [userWithDisabledWard],
        event: testEvent,
        signalSender,
        publisher,
      });

      await testNotification.sendSignals();

      expect(signalSender.sendSignal).not.toHaveBeenCalled();
    });

    it('should send no signals when notifications are turned off for a UserDevice', async () => {
      const disabledDevice = new UserDevice(false);
      const userWithDisabledDevice = new User('user-1', ['Ward 1'], [disabledDevice]);
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [userWithDisabledDevice],
        event: testEvent,
        signalSender,
        publisher,
      });

      await testNotification.sendSignals();

      expect(signalSender.sendSignal).not.toHaveBeenCalled();
    });
  });

  describe('publish', () => {
    it('should publish the notification to the publisher topic', async () => {
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      await testNotification.publish();

      expect(publisher.publish).toHaveBeenCalledTimes(1);
      const publishedMessage = JSON.parse(
        (publisher.publish as jest.Mock).mock.calls[0][0],
      );
      expect(publishedMessage).toEqual({
        id: 'notification-1',
        bed: testBed,
        organization: testOrganization,
        users: [testUser],
        event: testEvent,
      });
    });
  });

  describe('confirmForUser', () => {
    it('should create a new UserConfirmation for a User', () => {
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const beforeDate = new Date();
      const userConfirmation = testNotification.confirmForUser({
        userId: testUser.id,
      });
      const afterDate = new Date();

      expect(userConfirmation).toBeInstanceOf(UserConfirmation);
      expect(userConfirmation.confirmedBy).toEqual(testUser);
      expect(userConfirmation.confirmedAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(userConfirmation.confirmedAt.getTime()).toBeLessThanOrEqual(
        afterDate.getTime(),
      );
      expect(testNotification.userConfirmation).toEqual(userConfirmation);
    });

    it('should throw an error when confirmForUser is called with an unknown user', () => {
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      expect(() => {
        testNotification.confirmForUser({ userId: 'unknown-user-id' });
      }).toThrow(UserNotFoundError);
      expect(() => {
        testNotification.confirmForUser({ userId: 'unknown-user-id' });
      }).toThrow('User with id unknown-user-id not found in notification');
    });
  });

  describe('confirmForEvent', () => {
    it('should create a new AutoConfirmation for a LocationEvent', () => {
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const confirmingEvent = new LocationEvent(
        'wall-button-20',
        new Date().valueOf(),
      );

      const beforeDate = new Date();
      const autoConfirmation = testNotification.confirmForEvent(confirmingEvent);
      const afterDate = new Date();

      expect(autoConfirmation).toBeInstanceOf(AutoConfirmation);
      expect(autoConfirmation.confirmedBy).toEqual(confirmingEvent);
      expect(autoConfirmation.confirmedAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(autoConfirmation.confirmedAt.getTime()).toBeLessThanOrEqual(
        afterDate.getTime(),
      );
      expect(testNotification.autoConfirmation).toEqual(autoConfirmation);
    });

    it('should return an existing AutoConfirmation when an event is confirmed twice', () => {
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const confirmingEvent1 = new LocationEvent(
        'wall-button-20',
        new Date().valueOf(),
      );
      const confirmingEvent2 = new LocationEvent(
        'wall-button-20',
        new Date().valueOf() + 1000,
      );

      const firstConfirmation = testNotification.confirmForEvent(confirmingEvent1);
      const secondConfirmation = testNotification.confirmForEvent(confirmingEvent2);

      expect(secondConfirmation).toBe(firstConfirmation);
      expect(testNotification.autoConfirmation).toBe(firstConfirmation);
    });

    it('should throw an error when confirmForEvent is called with an event that has a different source', () => {
      const testNotification = new Notification({
        id: 'notification-1',
        organization: testOrganization,
        bed: testBed,
        users: [testUser],
        event: testEvent,
        signalSender,
        publisher,
      });

      const differentSourceEvent = new LocationEvent(
        'different-button',
        new Date().valueOf(),
      );

      expect(() => {
        testNotification.confirmForEvent(differentSourceEvent);
      }).toThrow(EventSourceMismatchError);
      expect(() => {
        testNotification.confirmForEvent(differentSourceEvent);
      }).toThrow('Event source mismatch: expected wall-button-20, but got different-button');
    });
  });
});
