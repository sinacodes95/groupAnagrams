import fs from 'fs';
import readline from 'readline';
import path from 'path';
import crypto from 'crypto';

const anagramsCollection: Record<string, string[]> = {};

const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
const ASCII_VALUE_OF_LOWERCASE_A = 97;
let currentWordLength = 0;
let isFirstWordDetected = false;

export const groupAnagrams = (filePath: string) => {
  const readableStream = readline.createInterface({
    input: fs.createReadStream(path.resolve(__dirname, filePath)),
    crlfDelay: Infinity,
  });

  readableStream
  .on('line', processWord)
  .on('close', printAndDelete);
}

export const processWord = (word: string) => {
  const wordHash = generateWordHash(word);
  (!isFirstWordDetected) && (currentWordLength = word.length, isFirstWordDetected = true);
  (word.length > currentWordLength) && printAndDelete(word.length); // printing and deleting all words of the previous length
  (wordHash in anagramsCollection) 
  ? anagramsCollection[wordHash].push(word)
  : anagramsCollection[wordHash] = [word];
}

export const generateWordHash = (word: string) => {
  const wordValue = word.split('').reduce((product, letter) => {
    const letterValue = letter.charCodeAt(0) - ASCII_VALUE_OF_LOWERCASE_A;
    product = BigInt(product) * BigInt(PRIME_NUMBERS[letterValue]);
    return product;
  }, BigInt(1));
  return crypto.createHash('md5').update(wordValue.toString(2)).digest('hex');
}

export const printAndDelete = (wordLength: number) => {
  currentWordLength = wordLength;
  for (let cachedWordValue in anagramsCollection) {
    const anagrams = anagramsCollection[cachedWordValue];
    process.stdout.write(anagrams.join(',') + '\n')
    delete anagramsCollection[cachedWordValue]
  }
}

// edge cases and error handling

groupAnagrams('../../Data/example1.txt');