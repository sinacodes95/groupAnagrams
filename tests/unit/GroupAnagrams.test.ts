import { GroupAnagrams } from '../../src/GroupAnagrams';
import { stdout } from 'test-console';

describe('Given a GroupAnagrams class has been declared' , () => {
  test('When imported into the tests file, it should be recognised as an object', () => {
    const groupAnagramsTest = new GroupAnagrams('../Data/example1.txt');
    expect(typeof groupAnagramsTest).toBe('object');
  });
  test('When a correct path has been given it should not throw an error', () => {
    const groupAnagramsTest = new GroupAnagrams('../Data/example1.txt');
    expect(() => groupAnagramsTest.main()).not.toThrowError();
  });
  test('When an incorrect path has been given it should throw an error', () => {
    const groupAnagramsTest = new GroupAnagrams('invalidpath');
    const groupAnagramsTest2 = new GroupAnagrams();
    expect(() => groupAnagramsTest.main()).toThrowError();
    expect(() => groupAnagramsTest2.main()).toThrowError();
  });
});

describe('Given a valid file path, printAndDelete' , () => {
  const groupAnagrams = new GroupAnagrams('../Data/example1.txt');
  test('Should print to stdout and delete groups of stored anagrams', () => {
    groupAnagrams.anagramsCollection = {
      hash001: ['abc','bca','acb'],
      hash002: ['aab','aba','baa'],
      hash003: ['hello'],
    }
    stdout.inspectSync((output) => {
      groupAnagrams.printAndDelete(0);
      expect(output).toEqual(['abc,bca,acb\n', 'aab,aba,baa\n', 'hello\n']);
    });

    expect(Object.values(groupAnagrams.anagramsCollection).length).toBe(0)
  });
});

describe('Given a valid file path, processWord' , () => {
  const groupAnagrams = new GroupAnagrams('../Data/example1.txt');
  test('Should return undefined early', () => {
    groupAnagrams.processWord('???%$£@')
    expect(Object.values(groupAnagrams.anagramsCollection).length).toBe(0)
  });
  test('Should populate the anagramsCollection', () => {
    groupAnagrams.processWord('hello')
    expect(Object.values(groupAnagrams.anagramsCollection)).toEqual([['hello']])
  });
  test('Should call printAndDelete if all word of the same length have been procecced', () => {
    const groupAnagrams = new GroupAnagrams('../Data/example1.txt');
    stdout.inspectSync((output) => {
      groupAnagrams.processWord('aba');
      groupAnagrams.processWord('baa');
      groupAnagrams.processWord('aab');
      groupAnagrams.processWord('hello');
      expect(output).toEqual(['aba,baa,aab\n']);
    });
  });
});

describe('Given a valid file path, generateWordHash' , () => {
  const groupAnagrams = new GroupAnagrams('../Data/example1.txt');
  test('Should produce the same hash for anagrams', () => {
    [
      groupAnagrams.generateWordHash('ethylenediaminetetraacetates'),
      groupAnagrams.generateWordHash('tatseenediaminetethyletraace'),
      groupAnagrams.generateWordHash('lenediaminetetraacettaseethy')
    ].every(hash => expect(hash).toBe('b512e1e3473902c8fca4a174f9487f4b'));
  });
});
