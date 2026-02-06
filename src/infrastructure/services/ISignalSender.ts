import { UserDevice } from '../../domain/UserDevice';

export interface ISignalSender {
  sendSignal(message: string, targets: UserDevice[]): Promise<void>;
}
