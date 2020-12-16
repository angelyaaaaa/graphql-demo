const { ApolloServer, gql } = require('apollo-server');
// ApolloServer: class to start server, implementing graphqla and basic web application(express)
// gql: template literal tag, able to use GraphQL syntax in js

// NOTE: fake data
const users = [
    {
        id: 1,
        name: 'Fong',
        age: 23
    },
    {
        id: 2,
        name: 'Kevin',
        age: 40
    },
    {
        id: 3,
        name: 'Mary',
        age: 18
    }
];


// 1. GraphQL Schema
const typeDefs = gql`
    """
    user info
    """
    type User {
        "ID"
        id: ID
        "Name"
        name: String
        "Age"
        age: Int
    }

    type Query {
        "A simple type for getting started!"
        hello: String
        "Get current user"
        me: User
    }
`;

// 2. Resolvers is a function mapping field in schema, abling to processing data first then return back to gql server
const resolvers = {
    Query: {
        // NOTE: absolutely map to field name in schema
        hello: () => 'world',
        me: () => users[0],
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`=== Server ready at ${url} ===`);
});