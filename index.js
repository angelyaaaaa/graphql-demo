const { ApolloServer, gql } = require('apollo-server');
// ApolloServer: class to start server, implementing graphqla and basic web application(express)
// gql: template literal tag, able to use GraphQL syntax in js

// NOTE: fake data
const users = [
    { id: 1, name: 'Fong', age: 23, hight: 172.4, weight: 63.2, friendIds: [2, 3] },
    { id: 2, name: 'Kevin', age: 40, hight: 192.2, weight: 90.5, friendIds: [1] },
    { id: 3, name: 'Mary', age: 18, hight: 166.6, weight: 53.8, friendIds: [1] }
];
const posts = [
    { id: 1, authorId: 1, title: "Hello World!", content: "This is my first post.", likeGiverIds: [2] },
    { id: 2, authorId: 2, title: "Good Night", content: "Have a Nice Dream =)", likeGiverIds: [2, 3] },
    { id: 3, authorId: 1, title: "I Love U", content: "Here's my second post!", likeGiverIds: [] },
];


// 1. GraphQL Schema
const typeDefs = gql`
    """
    height unit
    """
    enum HightUnit {
        METER
        CENTIMETER
        "1 foot = 30.48 cm"
        FOOT
    }

    """
    weight unit, this is a scalar type, so we declare it as all capital
    """
    enum WeightUnit {
        KILOGRAM
        GRAM
        "1 pound = 0.4535927 kilogram"
        POUND
    }

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
        "Height"
        hight(unit: HightUnit = CENTIMETER): Float
        "Wdight"
        weight(unit: WeightUnit = KILOGRAM): Float
        friends: [User]
    }

    """
    post info
    """
    type Post {
        id: ID!
        author: User
        title: String
        content: String
        likeGiverIds: [User]
    }

    type Query {
        "A simple type for getting started!"
        hello: String
        "Get current user"
        me: User
        users: [User]
        user(name: String!, id: ID): User
        posts: [Post]
        post(id: ID!): Post
    }

    type Mutation {
        # Assume poster is the one who post
        addPost(title: String!, content: String): Post
        likePost(postId: ID!): Post
    }
`;

// 2. Resolvers is a function mapping field in schema, abling to processing data first then return back to gql server
const meId = 1; // shoud get from interior system
const resolvers = {
    Query: {
        // NOTE: absolutely map to field name in schema
        hello: () => 'world',
        me: () => users[0],
        users: () => users,
        user: (root, args) => {
            const { name } = args;
            return users.find(user => user.name === name);
        },
        posts: () => posts,
        post: (root, args) => {
            const { id } = args;
            return posts.find(post => post.id === id);
        }
    },
    Mutation: {
        addPost: (root, args) => {
            const { title, content } = args;
            const newPost = {
                id: posts.length + 1,
                authorId: meId,
                title,
                content,
                likeGiverIds: []
            }
            posts.push(newPost);
            return posts[posts.length - 1];
        },
        likePost: (root, args) => {
            // with toggle like function
            const { postId } = args;
            const targetPost = posts[postId - 1];
            const { likeGiverIds } = targetPost;

            if (likeGiverIds.includes(meId)) {
                likeGiverIds.splice(c.index(meId), 1);
            } else {
                likeGiverIds.push(meId);
            }
            return targetPost;
        },
    },
    User: {
        hight: (parent, args) => {
            const { unit } = args;
            if (!unit || unit === 'CENTIMETER') {
                return parent.hight;
            } else if (unit === 'METER') {
                return parent.hight / 100;
            } else if (unit === 'FOOT') {
                return parent.hight / 30.48;
            }
            throw new Error(`Hight Unit ${unit} not support`);
        },
        weight: (parent, args) => {
            const { unit } = args;
            if (!unit || unit === 'KILOGRAM') {
                return parent.weight;
            } else if (unit === 'GRAM') {
                return parent.weight * 100;
            } else if (unit === 'POUND') {
                return parent.weight / 0.4535927;
            }
            throw new Error(`Weight Unit ${unit} not support`);
        },
        friends: (parent, args) => {
            const { friendIds } = parent;
            return users.filter((user) => friendIds.includes(user.id) )
        }
    },
    Post: {
        author: (parent, args) => {
            const { authorId } = parent;
            return users.find(user => user.id === authorId);
        },
        likeGiverIds: (parent, args) => {
            const { likeGiverIds } = parent;
            return users.filter(user => likeGiverIds.includes(user.id));
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`=== Server ready at ${url} ===`);
});