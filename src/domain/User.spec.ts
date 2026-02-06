import { User } from './User';

describe('User', () => {
  describe('hasDisabledWard', () => {
    it('should return false when a User has the ward enabled', () => {
      const testUser = new User('user-1', ['Ward 1'], []);
      expect(testUser.hasDisabledWard({ ward: 'Ward 1' })).toEqual(false);
    });

    it('should return true when a User has the ward not enabled', () => {
      const testUser = new User('user-1', [], []);
      expect(testUser.hasDisabledWard({ ward: 'Ward 1' })).toEqual(true);
    });
  });
});
