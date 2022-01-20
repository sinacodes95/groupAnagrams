import { GroupAnagrams } from "./GroupAnagrams";

const handleError = (error: any) => {
  // This function would likely trigger an external system such as Sentry or a slack integration which would alert me of the error
  // However, in this case we will just console.log the error
  console.log('Error Handler: ', error);
}

try {
  const groupAnagrams = new GroupAnagrams(`../../${process.argv[2]}`);
  groupAnagrams.main();
} catch (error) {
  handleError(error);
}
