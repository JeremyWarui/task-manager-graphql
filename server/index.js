const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/user')
const Task = require('./models/task')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to MONGODB')

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to MONGODB'))
  .catch((error) => {
    console.log('error connecting to MONGODB', error.message)
  })

const typeDefs = `

    type User {
        username: String!
        tasks: [Task!]!
        id: ID!
    }

    type Task {
        id: ID!
        title: String!
        description: String
        done: Boolean!
        user: User
    }
        
    type Token {
        value: String!
    }

    type Query {
        dummy: String
        taskCount: Int!
        allTasks(status: String): [Task!]!
        me: User
    }

    type Mutation {
        createUser(
            username: String!
        ): User

        login(
            username: String!
            password: String!
        ): Token

        addTask(
            title: String!
            description: String
            done: Boolean!
        ): Task
    }
`

const resolvers = {
  Query: {
    dummy: () => 'Hello World',
    taskCount: async () => await Task.countDocuments(),
    allTasks: async (root, args) => {
      return await Task.find({}).populate('user')
    },
    me: (root, args) => 'current user',
  },
  User: {
    tasks: async (user) => {
      return await Task.find({ user: user.id })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => console.log(`Server ready at ${url}`))
