import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import glob from 'glob';
import fs from 'fs';

const genSchema = () => {
  const pathToSchema = path.join(__dirname, '../schemas');
  const graphqlTypes = glob
    .sync(`${pathToSchema}/**/*.graphql`)
    .map(x => fs.readFileSync(x, { encoding: 'utf8' }));

  const resolvers = glob
    .sync(`${pathToSchema}/**/resolvers.js`)
    .map(resolver => require(resolver).default);

  return makeExecutableSchema({
    typeDefs: mergeTypes(graphqlTypes),
    resolvers: mergeResolvers(resolvers),
  });
};

export default genSchema;
