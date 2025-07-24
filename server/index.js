const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const tasks = [
  {
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
    title: 'Finish GraphQL tutorial',
    description: 'Complete the FullstackOpen GraphQL module exercises',
    done: false,
  },
  {
    id: '5b1fc3d0-993c-4e76-9015-3a58fe7a19e2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and cheese',
    done: true,
  },
  {
    id: '29be2b74-3d90-4c1d-bbcc-bc64c00c7e9e',
    title: 'Plan weekend trip',
    description: 'Decide on a destination and book hotel',
    done: false,
  },
  {
    id: '9f8e5a92-6fdd-4c19-9273-21a7f509bcda',
    title: 'Clean workspace',
    description: 'Organize desk and delete unused files',
    done: true,
  },
  {
    id: 'c3ad1623-94cd-4bde-9239-ecebc2b0d8db',
    title: 'Read GraphQL docs',
    description: 'Focus on Apollo Server and client sections',
    done: false,
  },
]

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
    taskCount: () => tasks.length,
    allTasks: (root, args) => {
      return tasks
    },
    me: (root, args) => 'current user',
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => console.log(`Server ready at ${url}`))
