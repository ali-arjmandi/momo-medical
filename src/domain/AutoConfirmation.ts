import { LocationEvent } from './LocationEvent';

export class AutoConfirmation {
  constructor(
    public confirmedAt: Date,
    public confirmedBy: LocationEvent,
  ) {}
}
