import { AutoConfirmation } from './AutoConfirmation';
import { Bed } from './Bed';
import { LocationEvent } from './LocationEvent';
import { Notification } from './Notification';
import { Organization } from './Organization';
import { User } from './User';
import { UserConfirmation } from './UserConfirmation';
import { UserDevice } from './UserDevice';

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
    it('should send signals for all UserDevices', () => {
      throw Error('Not implemented');
    });

    it('should send no signals when the Organization has notifications disabled', () => {
      throw Error('Not implemented');
    });

    it('should send no signals when notifications are turned off for the Bed', () => {
      throw Error('Not implemented');
    });

    it('should send no signals when a User has disabled the ward', () => {
      throw Error('Not implemented');
    });

    it('should send no signals when notifications are turned off for a UserDevice', () => {
      throw Error('Not implemented');
    });
  });

  describe('publish', () => {
    it('should publish the notification to the publisher topic', () => {
      throw Error('Not implemented');
    });
  });

  describe('confirmForUser', () => {
    it('should create a new UserConfirmation for a User', () => {
      throw Error('Not implemented');
    });

    it('should throw an error when confirmForUser is called with an unknown user', () => {
      throw Error('Not implemented');
    });
  });

  describe('confirmForEvent', () => {
    it('should create a new AutoConfirmation for a LocationEvent', () => {
      throw Error('Not implemented');
    });

    it('should return an existing AutoConfirmation when an event is confirmed twice', () => {
      throw Error('Not implemented');
    });

    it('should throw an error when confirmForEvent is called with an event that has a different source', () => {
      throw Error('Not implemented');
    });
  });
});
