import { UserDevice } from './UserDevice';

export interface ISignalSender {
  sendSignal(message: string, targets: UserDevice[]): Promise<void>;
}
