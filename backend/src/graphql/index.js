import path from 'path';

import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { SearchSubFolders } from 'utils';

// import { SearchSubFolders } from '../utils/utils';

var schemaFolders = SearchSubFolders(path.join(__dirname, './schemas'));
console.log('\n\n');

let schemasArray = [];
schemaFolders.forEach(function (folder) {
  let fundArray = loadFilesSync(folder);
  schemasArray = schemasArray.concat(fundArray);
});
// ----------------------- RESOLVERS -----------------------------------
var resolversFolders = SearchSubFolders(path.join(__dirname, './resolvers'));
// console.log(resolversFolders);

let resolversArray = [];
resolversFolders.forEach(function (folder) {
  let fundArray = loadFilesSync(folder);
  resolversArray = resolversArray.concat(fundArray);
});

// ----------------------------------------------------------------
const RESOLVERS = {
  typeDefs: mergeTypeDefs(schemasArray),
  resolvers: mergeResolvers(resolversArray),
};
export default RESOLVERS;
