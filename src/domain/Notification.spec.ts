import { Bed } from './Bed';
import { LocationEvent } from './LocationEvent';
import { Notification } from './Notification';
import { Organisation } from './Organisation';
import { User } from './User';
import { UserDevice } from './UserDevice';

describe('Notification', () => {
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
  });

  it('should instantiate a Notification', () => {
    const id = 'notification-1';
    const testNotification = new Notification({
      id,
      organisation: testOrganisation,
      bed: testBed,
      users: [testUser],
      event: testEvent,
      signalSender,
      publisher,
    });

    expect(testNotification).toBeInstanceOf(Notification);
    expect(testNotification.id).toEqual(id);
    expect(testNotification.bed).toEqual(testBed);
    expect(testNotification.organisation).toEqual(testOrganisation);
    expect(testNotification.users).toEqual([testUser]);
    expect(testNotification.event).toEqual(testEvent);
  });

  describe('toJSON', () => {
    it('should convert a Notification to a correct JSON representation', () => {
      throw Error('Not implemented');
    });
  });

  describe('sendSignals', () => {
    it('should send signals for all UserDevices', () => {
      throw Error('Not implemented');
    });

    it('should send no signals when the Organisation has notifications disabled', () => {
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
