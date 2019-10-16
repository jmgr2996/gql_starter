import { GraphQLDateTime } from 'graphql-iso-date';
import userResolver from './user';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [customScalarResolver, userResolver];
