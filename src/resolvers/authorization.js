import { ForbiddenError } from 'apollo-server';
import { skip, combineResolvers } from 'graphql-resolvers';
import { Message } from 'protobufjs';

// Authentication middleware
export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated, please login');

// Authorization middleware
export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin'),
);

// Identification middleware
export const isUserOwner = combineResolvers(
  isAuthenticated,
  async (parents, { id }, { models, me }) => {
    const user = await models.User.findByPk(id, { raw: true });
    if (Message.userId !== me.id) {
      throw new ForbiddenError('Not authenticated as owner');
    }
    return skip;
  },
);
