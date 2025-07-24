const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/user')
const Task = require('./models/task')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to MONGODB')

const users = [
  {
    id: '1a2b3c4d-aaaa-bbbb-cccc-111122223333',
    username: 'alice',
  },
  {
    id: '2b3c4d5e-bbbb-cccc-dddd-222233334444',
    username: 'bob',
  },
  {
    id: '3c4d5e6f-cccc-dddd-eeee-333344445555',
    username: 'charlie',
  },
]

const tasks = [
  {
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
    title: 'Finish GraphQL tutorial',
    description: 'Complete the FullstackOpen GraphQL module exercises',
    done: false,
    user: '2b3c4d5e-bbbb-cccc-dddd-222233334444',
  },
  {
    id: '5b1fc3d0-993c-4e76-9015-3a58fe7a19e2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and cheese',
    done: true,
    user: '1a2b3c4d-aaaa-bbbb-cccc-111122223333',
  },
  {
    id: '29be2b74-3d90-4c1d-bbcc-bc64c00c7e9e',
    title: 'Plan weekend trip',
    description: 'Decide on a destination and book hotel',
    done: false,
    user: '3c4d5e6f-cccc-dddd-eeee-333344445555',
  },
  {
    id: '9f8e5a92-6fdd-4c19-9273-21a7f509bcda',
    title: 'Clean workspace',
    description: 'Organize desk and delete unused files',
    done: true,
    user: '3c4d5e6f-cccc-dddd-eeee-333344445555',
  },
  {
    id: 'c3ad1623-94cd-4bde-9239-ecebc2b0d8db',
    title: 'Read GraphQL docs',
    description: 'Focus on Apollo Server and client sections',
    done: false,
    user: '1a2b3c4d-aaaa-bbbb-cccc-111122223333',
  },
]

const populateDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Task.deleteMany({})
    console.log('Cleared existing data')

    // Create users first
    const createdUsers = []
    for (const userData of users) {
      const user = new User({
        username: userData.username,
        tasks: [], // Will be populated after creating tasks
      })
      const savedUser = await user.save()
      createdUsers.push({ ...userData, mongoId: savedUser._id })
      console.log(`Created user: ${userData.username}`)
    }

    // Create tasks and establish relationships
    for (const taskData of tasks) {
      // Find the corresponding user
      const userRef = createdUsers.find((u) => u.id === taskData.user)
      if (!userRef) {
        console.log(`User not found for task: ${taskData.title}`)
        continue
      }

      // Create task with user reference
      const task = new Task({
        title: taskData.title,
        description: taskData.description,
        done: taskData.done,
        user: userRef.mongoId,
      })
      const savedTask = await task.save()
      console.log(`Created task: ${taskData.title}`)

      // Add task to user's tasks array
      await User.findByIdAndUpdate(userRef.mongoId, {
        $push: { tasks: savedTask._id },
      })
    }

    console.log('Database populated successfully!')
  } catch (error) {
    console.error('Error populating database:', error)
  }
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MONGODB')
    return populateDatabase()
  })
  .catch((error) => {
    console.log('error connecting to MONGODB', error.message)
  })
  .finally(() => {
    mongoose.connection.close()
    console.log('🔌 Disconnected from MongoDB.')
  })
