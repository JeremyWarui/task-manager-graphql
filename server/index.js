const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/user')
const Task = require('./models/task')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

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
        allUsers: [User!]!
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
            description: String!
        ): Task

        editTask(
            id: ID!
        ): Task
    }
`

const resolvers = {
  Query: {
    dummy: () => 'Hello World',
    taskCount: async () => await Task.countDocuments(),
    allUsers: async () => await User.find({}),
    allTasks: async (root, args) => {
      let filter = {}
      if (args.status === 'done') {
        filter.done = true
      }
      if (args.status === 'pending') {
        filter.done = false
      }
      return await Task.find(filter).populate('user')
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  User: {
    tasks: async (user) => {
      return await Task.find({ user: user.id })
    },
  },
  Mutation: {
    addTask: async (root, args, context) => {
      const { currentUser } = context

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        const task = new Task({
          title: args.title,
          description: args.description,
          user: currentUser._id,
        })
        await task.save()
        await User.findByIdAndUpdate(currentUser._id, {
          $push: { tasks: task._id },
        })
        await task.populate('user')
        return task
      } catch (error) {
        let message = 'Saving new task failed'
        if (error.name === 'ValidationError') {
          message =
            'title(minimum of 5 characters) and done is required; Description of atleast 5 characters'
        }
        throw new GraphQLError(message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    editTask: async (root, args, context) => {
      const { currentUser } = context

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        const taskToUpdate = await Task.findById(args.id)
        if (!taskToUpdate) {
          throw new GraphQLError('task not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          })
        }

        if (taskToUpdate.user.toString() !== currentUser._id) {
          throw new GraphQLError('not authorized', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          })
        }

        const updatedTask = await Task.findByIdAndUpdate(
          args.id,
          { done: !taskToUpdate.done },
          { new: true }
        ).populate('user')

        return updatedTask
      } catch (error) {
        throw new GraphQLError('failed to update the task', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username })
      try {
        return await user.save()
      } catch (error) {
        let message = 'Creating user failed'
        if (error.code === 11000) message = 'username must be unique'
        throw new GraphQLError(message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user && args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userPayload = { username: user.username, id: user._id }
      const token = jwt.sign(userPayload, process.env.JWT_SECRET)
      return { value: token }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => console.log(`Server ready at ${url}`))
