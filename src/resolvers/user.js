import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    me: async (parent, args, { models, me }) => {
      if (!me) return null;
      return await models.User.findByPk(me.id);
    },
    users: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) => await models.User.findAll(),
    ),
    user: async (parent, { id }, { models }) =>
      await models.User.findByPk(id),
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password, gender },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
        gender,
      });
      return { token: createToken(user, secret, '30m') };
    },

    signIn: async (
      parent,
      { username, password },
      { models, secret },
    ) => {
      const user = await models.User.findByUsername(username);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('User not found');
      }

      return {
        token: createToken(user, secret, '30m'),
      };
    },
  },
};
