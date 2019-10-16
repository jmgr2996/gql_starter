import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
      gender: String!
    ): Token!

    signIn(username: String!, password: String!): Token!
  }

  type User {
    id: ID!
    createdAt: Date!
    email: String!
    gender: String!
    password: String!
    role: String!
    username: String!
  }

  type Token {
    token: String!
  }
`;
