import fs from 'fs';
import readline from 'readline';
import path from 'path';
import crypto from 'crypto';


export class GroupAnagrams {
  
  anagramsCollection: Record<string, string[]> = {};
  PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
  ASCII_VALUE_OF_LOWERCASE_A = 97;
  previousWordLength = 0;
  isFirstWordDetected = false;
  filePath?: string;

  constructor (filePath?: string) {
    this.filePath = this.validateUserInput(filePath);
  }
  
  main() {
    if (!this.filePath || (this.filePath && !fs.existsSync(this.filePath))) {
      throw Error('File path does not exist, please provide a valid file path');
    }
    const readableWordsStream = readline.createInterface({
      input: fs.createReadStream(this.filePath),
      crlfDelay: Infinity,
    });
    readableWordsStream
    .on('line', this.processWord)
    .on('close', this.printAndDelete);
  }
  
  processWord = (word: string) => {
    if (!(/[a-z]/g).test(word)) {
      console.log(`Word "${word}" is not valid data, it has been ignored`)
      return;
    }
    const wordHash = this.generateWordHash(word);
    (!this.isFirstWordDetected) && (this.previousWordLength = word.length, this.isFirstWordDetected = true);
    // printing and deleting all words of the previous length 
    // since according to the instructions all words of the same size may fit into memory but not all words of different sizes.
    (word.length > this.previousWordLength) && this.printAndDelete(word.length);
    (wordHash in this.anagramsCollection) 
    ? this.anagramsCollection[wordHash].push(word)
    : this.anagramsCollection[wordHash] = [word];
  };
  
  generateWordHash = (word: string) => {
    const wordValue = word.split('').reduce((product, letter) => {
      const letterValue = letter.charCodeAt(0) - this.ASCII_VALUE_OF_LOWERCASE_A;
      return BigInt(product) * BigInt(this.PRIME_NUMBERS[letterValue]);
    }, BigInt(1));
    return crypto.createHash('md5').update(wordValue.toString(2)).digest('hex');
  };
  
  printAndDelete = (wordLength: number) => {
    this.previousWordLength = wordLength;
    for (const cachedWordValue in this.anagramsCollection) {
      const anagrams = this.anagramsCollection[cachedWordValue];
      process.stdout.write(anagrams.join(',') + '\n')
      delete this.anagramsCollection[cachedWordValue]
    }
  };

  validateUserInput = (input?: string) => {
    if (!input || !(/^(.+)\/([^\/]+)$/g).test(input)) throw Error(`Invalid input: ${input}`);
    return path.resolve(__dirname, input)
  }
}
