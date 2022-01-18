import { groupAnagrams } from '../../src/index'

describe('Given a function has been defined' , () => {
  test('When imported into the tests, it should be recognised as a function', () => {
    expect(typeof groupAnagrams).toBe('function');
  });
});