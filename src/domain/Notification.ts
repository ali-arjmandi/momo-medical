import { AutoConfirmation } from './AutoConfirmation';
import { type Bed } from './Bed';
import { type LocationEvent } from './LocationEvent';
import { type Organization } from './Organization';
import { type User } from './User';
import { UserConfirmation } from './UserConfirmation';
import { type IPublisher } from '../infrastructure/services/IPublisher';
import { type ISignalSender } from '../infrastructure/services/ISignalSender';

interface NotificationParams {
  id: string;
  bed: Bed;
  organization: Organization;
  users: User[];
  event: LocationEvent;
  signalSender: ISignalSender;
  publisher: IPublisher;
  userConfirmation?: UserConfirmation;
  autoConfirmation?: AutoConfirmation;
}

export interface NotificationJSON {
  id: string;
  bed: Bed;
  organization: Organization;
  users: User[];
  event: LocationEvent;
  userConfirmation?: {
    confirmedAt: string;
    confirmedBy: User;
  };
  autoConfirmation?: {
    confirmedAt: string;
    confirmedBy: LocationEvent;
  };
}

export class Notification {
  public readonly id: string;
  public readonly bed: Bed;
  public readonly organization: Organization;
  public readonly users: User[];
  public readonly event: LocationEvent;
  public userConfirmation?: UserConfirmation;
  public autoConfirmation?: AutoConfirmation;
  // @ts-expect-error Remove this once the member is used in a method
  private readonly signalSender: ISignalSender;
  // @ts-expect-error Remove this once the member is used in a method
  private readonly publisher: IPublisher;

  constructor({
    id,
    bed,
    organization,
    users,
    event,
    userConfirmation,
    autoConfirmation,
    signalSender,
    publisher,
  }: NotificationParams) {
    this.id = id;
    this.bed = bed;
    this.organization = organization;
    this.users = users;
    this.event = event;
    this.signalSender = signalSender;
    this.publisher = publisher;
    this.userConfirmation = userConfirmation;
    this.autoConfirmation = autoConfirmation;
  }

  /**
   * Sends push notifications to users who have notifications enabled
   *
   * @throws {Error} If signal sender is not set
   * @throws {Error} If sending signal fails
   */
  async sendSignals() {}

  async publish() {}

  toJSON(): NotificationJSON {
    return {
      id: this.id,
      bed: this.bed,
      organization: this.organization,
      users: this.users,
      event: this.event,
      ...(this.userConfirmation && {
        userConfirmation: {
          confirmedAt: this.userConfirmation.confirmedAt.toISOString(),
          confirmedBy: this.userConfirmation.confirmedBy,
        },
      }),
      ...(this.autoConfirmation && {
        autoConfirmation: {
          confirmedAt: this.autoConfirmation.confirmedAt.toISOString(),
          confirmedBy: this.autoConfirmation.confirmedBy,
        },
      }),
    };
  }

  // @ts-expect-error Remove this once the method is implemented
  confirmForUser({}: { userId: string }): UserConfirmation {}

  // @ts-expect-error Remove this once the method is implemented
  confirmForEvent(_event: LocationEvent): AutoConfirmation {}
}
