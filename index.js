const { ApolloServer, gql } = require('apollo-server');
// ApolloServer: class to start server, implementing graphqla and basic web application(express)
// gql: template literal tag, able to use GraphQL syntax in js

// NOTE: fake data
const users = [
    { id: 1, name: 'Fong', age: 23, friendIds: [2, 3] },
    { id: 2, name: 'Kevin', age: 40, friendIds: [1] },
    { id: 3, name: 'Mary', age: 18, friendIds: [1] }
];


// 1. GraphQL Schema
const typeDefs = gql`
    """
    user info
    """
    type User {
        "ID"
        id: ID!
        "Name"
        name: String
        "Age"
        age: Int
        friends: [User]
    }

    type Query {
        "A simple type for getting started!"
        hello: String
        "Get current user"
        me: User
        users: [User]
    }
`;

// 2. Resolvers is a function mapping field in schema, abling to processing data first then return back to gql server
const resolvers = {
    Query: {
        // NOTE: absolutely map to field name in schema
        hello: () => 'world',
        me: () => users[0],
        users: () => users
    },
    User: {
        friends: (parent, args, context) => {
            const { friendIds } = parent;
            return users.filter((user) => friendIds.includes(user.id) )
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`=== Server ready at ${url} ===`);
});