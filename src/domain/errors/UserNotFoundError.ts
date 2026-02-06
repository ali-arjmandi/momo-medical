export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User with id ${userId} not found in notification`);
    this.name = 'UserNotFoundError';
  }
}
