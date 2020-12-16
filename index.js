const { ApolloServer, gql } = require('apollo-server');
// ApolloServer: class to start server, implementing graphqla and basic web application(express)
// gql: template literal tag, able to use GraphQL syntax in js

// 1. GraphQL Schema
const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;

// 2. Resolvers is a function mapping field in schema, abling to processing data first then return back to gql server
const resolvers = {
    Query: {
        // NOTE: absolutely map to field name in schema
        hello: () => 'world'
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`? Server ready at ${url}`);
});