import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import { createUsers, getMe, eraseDatabaseOnSync } from './utils';

// Instance express
const app = express();

// Define port
const port = process.env.PORT || 1234;

// Apply cors middleware
app.use(cors());

//Instance Apollo Server
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // Format error messages
    const message = error.message
      .replace('SequelizeValidationError', '')
      .replace('Validation error', '');
    return { ...error, message };
  },
  context: async ({ req }) => {
    // Get current user and set context helpers
    const me = await getMe(req);
    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
});

// Enable DB
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  // Seed DB
  if (eraseDatabaseOnSync) {
    createUsers(new Date());
  }

  // Enable server
  app.listen({ port }, () => {
    console.log(`Graphql server running at port ${port}`);
  });
});

server.applyMiddleware({ app, path: '/api' });
