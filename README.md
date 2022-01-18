# Constraints
  - Function recieves file path at run time
  - Groups of anagrams are written to process.stdout
  - Words within groups separated by `,` and groups separated by `\n`
  - Order of output does not matter - no need to sort alphabetically
  - Assumption: There are no duplicates, based on test data
  - Assumption: All letters are lower case, based on test data
  - Assumption: Each line of the file contains exactly one word, based on test date

  ## Example:
    command_to_run_your_program Data/example1.txt
    Output:
    abc,bac,cba
    unf,fun
    hello
 
  - Words in input file are ordered by size (Ascending order)
  - The file may be too large to fit into memory (a readable stream can be used here)
  - Words do not have to be actual english words
  - Input files may be much larger than the data files provided

  - Code should be production ready:
    - eslint, unit tests, dockerised, efficient and maintainable.
  - Should include tests covering:
    - Edge cases, Non-trivial functional tests, Randomised tests, and possibly load tests.
  - Good error/exceptions handling
  - Good separation of concerns
  - Efficient use of resources such as CPU, Memory...
  - Uses Clean Code principles.
  - NO external libraries allowed for implementation of groupAnagrams function and it's helper functions.

# Ideas & T/S Complexity
In this solution I have come up with 3 ideas, each one being (arguably) an improvement on the previous. Thus, I have chosen to go with idea 3.
## Idea 1 (Naive Approach)
1. To avoid loading the whole file into memory a readable stream can be generated.
2. Each line (word) within the file can be read and processed independently.
3. To make all words equal to it's anagram it can be alphabetically sorted -> `this will likely be a bottle neck`
4. Create a map with the a word as a key and the value will be an array of it's anagrams.
5. Condition check whether the word exists in the map if true it adds to the list, if false it creates the list -> `may also be a bottle neck as the map can get very big`
6. Then iterate through map and print its values.

  #### Time Complexity
    - Streaming uses iteration which will be `O(n)`
    - Each word will be sorted, JavaScript internally uses a merge sort solution which has a time complexity of `O(m * logm)`
    - Over all: `O(n * m * logm)`

  #### Space Complexity
    - Each word will be stored in the map with their group resulting in O(n * m) -> definite bottle neck maybe an external cache such as redis can be used?

## Idea 2 (Remove sorting bottle neck)
1. This idea will be similar to the first idea except step 3 where the need for sorting each word will be removed.
2. A common way of calculating equality of words is to compare the product of the ASCII values of the letters.
3. However it is possible different combinations of letters may produce the same result and a method of unique value generation is required.
4. A common pattern is to use prime numbers, to avoid the issue stated above, as when selected prime numbers are multiplied they'll produce unique values for each word expect anagrams.
5. The size of the map can be improved by taking advantage of the assumption that the words are sorted in ascending order.
As anagrms can only be of the same length once all words for a certain length have been proccessed they can be printed out
and their position in the map deleted to avoid storing all words within the map. This is still however `O(n * m)` complexity in worst case.

  #### Time Complexity
    - Streaming uses iteration which will be `O(n)`.
    - I will have to iterate through each word in order to calculate it's value based on the prime numbers which is `O(m)`.
    - Overall: `O(n * m)`

  #### Space Complexity
    -  Does not improve in the worst case - Each word will be stored in the map with their group resulting in `O(n * m)`

## Idea 3 (Remove mapping bottle neck)
1. This idea will build apon ideas 1 and 2.
2. We can improve the space complexity further by providing an external cache solution such as Redis to store the groups of anagrams.

  #### Time Complexity
    - Will remain `O(n * m)`

  #### Space Complexity
    -  Will improve as only one word will be loaded into memory at a time `O(m)`

# Code
## Chosen Language
I have chosen TypeScript as I am comfortable using it and it will sufficient for this solution

### How To Run
#### Pre-requisites:
 - Node.js and NPM

To run the app you may do:
```
$ npm install
$ npm run build
$ node ./build/index.js <FILE_PATH>
```
To run the tests you may do:
```
$ npm install
$ npm run test
```
### Big O Analysis
I will implement idea 3 which will have a time complexity of `O(n * m)` and a space complexity of `O(m)`.
### Reasons Behind Data Structures Chosen
I will use an array of length 26 to store the first 26 prime numbers which will be used to generate unique values for words and it's anagrams.
The reason to use an array instead of an map is because an array will have set indecies which can be used to link to each letter of the word instead of having
a key value pair of prime number to letter.
### What I Would Do Given More Time
  #### Dockerisation
  Given more time I would dockerised the app to ensure that it runs independantly of the machine and it would have the same environment on any other
  machine.
  This would improve maintainability and resiliance as all configuration can be defined within the dockerfile without worrying about whether a user is
  using a different version of typescript, node, npm etc.
  #### Monitoring, Logging and CPU, memory, disk metrics.
  - Given more time and resources I would improve the monitoring by collecting metrics on the instance which this code was running on.
  - These metrics would be useful to identify bottle necks and for load testing the application.
  - Alarms can be set up using these metrics in order to alert me of any incidents.
  - Improved logging will make it easier to identify bugs and problematic inputs which may cause errors.
  - A CI/CD pipeline will allow for easier iterations and improvements of the code.

# Tests

