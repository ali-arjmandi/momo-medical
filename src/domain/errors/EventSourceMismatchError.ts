export class EventSourceMismatchError extends Error {
  constructor(
    expectedSource: string,
    actualSource: string,
  ) {
    super(
      `Event source mismatch: expected ${expectedSource}, but got ${actualSource}`,
    );
    this.name = 'EventSourceMismatchError';
  }
}
