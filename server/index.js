const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const tasks = [
  {
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
    title: 'Finish GraphQL tutorial',
    description: 'Complete the FullstackOpen GraphQL module exercises',
    done: false,
    dueDate: '2025-07-28T00:00:00.000Z',
  },
  {
    id: '5b1fc3d0-993c-4e76-9015-3a58fe7a19e2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and cheese',
    done: true,
    dueDate: '2025-07-22T00:00:00.000Z',
  },
  {
    id: '29be2b74-3d90-4c1d-bbcc-bc64c00c7e9e',
    title: 'Plan weekend trip',
    description: 'Decide on a destination and book hotel',
    done: false,
    dueDate: '2025-07-30T00:00:00.000Z',
  },
  {
    id: '9f8e5a92-6fdd-4c19-9273-21a7f509bcda',
    title: 'Clean workspace',
    description: 'Organize desk and delete unused files',
    done: true,
    dueDate: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'c3ad1623-94cd-4bde-9239-ecebc2b0d8db',
    title: 'Read GraphQL docs',
    description: 'Focus on Apollo Server and client sections',
    done: false,
    dueDate: '2025-07-25T00:00:00.000Z',
  },
]

const typeDefs = `
    type Query {
        dummy: String
    }
`

const resolvers = {
  Query: {
    dummy: () => 'Hello World',
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => console.log(`Server ready at ${url}`))
