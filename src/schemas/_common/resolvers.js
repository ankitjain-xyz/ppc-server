import { GraphQLScalarType } from 'graphql';
import moment from 'moment';

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue: value => moment(value).toDate(), // value from the client
    serialize: value => value.getTime(), // value sent to the client
    parseLiteral: ast => ast,
  }),
};
