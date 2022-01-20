import { GroupAnagrams } from "./GroupAnagrams";

const groupAnagrams = new GroupAnagrams(`../../${process.argv[2]}`);
groupAnagrams.main();