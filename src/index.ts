import fs from 'fs';
import readline from 'readline';
import path from 'path';

const redisCache: Record<string, string[]> = {};
const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
const ASCII_VALUE_OF_A = 97;
let currentWordLength = 0;
let isFirstWordDetected = false;

export const groupAnagrams = (filePath: string) => {
  const readableStream = readline.createInterface({
    input: fs.createReadStream(path.resolve(__dirname, filePath)),
    crlfDelay: Infinity
  });

  readableStream.on('line', processWord);
}

export const processWord = (word: string) => {
  const wordValue = generateWordValue(word);
  (!isFirstWordDetected) && (currentWordLength = word.length, isFirstWordDetected = true);
  (wordValue in redisCache) ? redisCache[wordValue].push(word) : redisCache[wordValue] = [word];
  (word.length > currentWordLength) && printAndDelete(word.length);
}

export const generateWordValue = (word: string) => {
  return word.split('').reduce((product, letter) => {
    const letterValue = letter.charCodeAt(0) - ASCII_VALUE_OF_A;
    product = product * primeNumbers[letterValue];
    return product;
  }, 1);
}

export const printAndDelete = (wordLength: number) => {
  currentWordLength = wordLength;
  for (let cachedWordValue in redisCache) {
    console.log(redisCache[cachedWordValue]) // should be process.stdout
    delete redisCache[cachedWordValue]
  }
}

groupAnagrams('../../Data/example1.txt');