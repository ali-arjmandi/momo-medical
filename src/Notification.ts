import { AutoConfirmation } from './AutoConfirmation';
import { type Bed } from './Bed';
import { type IPublisher } from './IPublisher';
import { type ISignalSender } from './ISignalSender';
import { type LocationEvent } from './LocationEvent';
import { type Organisation } from './Organisation';
import { type User } from './User';
import { UserConfirmation } from './UserConfirmation';

interface NotificationParams {
  id: string;
  bed: Bed;
  organisation: Organisation;
  users: User[];
  event: LocationEvent;
  signalSender: ISignalSender;
  publisher: IPublisher;
  userConfirmation?: UserConfirmation;
  autoConfirmation?: AutoConfirmation;
}

export class Notification {
  public readonly id: string;
  public readonly bed: Bed;
  public readonly organisation: Organisation;
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
    organisation,
    users,
    event,
    userConfirmation,
    autoConfirmation,
    signalSender,
    publisher,
  }: NotificationParams) {
    this.id = id;
    this.bed = bed;
    this.organisation = organisation;
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

  toJSON() {}

  // @ts-expect-error Remove this once the method is implemented
  confirmForUser({}: { userId: string }): UserConfirmation {}

  // @ts-expect-error Remove this once the method is implemented
  confirmForEvent(_event: LocationEvent): AutoConfirmation {}
}
