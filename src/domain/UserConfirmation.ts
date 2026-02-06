import { User } from './User';

export class UserConfirmation {
  constructor(
    public confirmedAt: Date,
    public confirmedBy: User,
  ) {}
}
