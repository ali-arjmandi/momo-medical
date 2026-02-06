import { UserDevice } from './UserDevice';

export class User {
  constructor(
    public id: string,
    public enabledWards: string[],
    public userDevices: UserDevice[],
  ) {}

  hasDisabledWard({ ward }: { ward: string }): boolean {
    return !this.enabledWards.includes(ward);
  }
}
