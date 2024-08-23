const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  },
  {
    title: 'Monkey mode',
    author: 'Tossavainen',
    url: 'blaablaa.pdf',
    likes: 4
  }
]

const nonExistingId = async () => {
  const blog = new Blog(
  { 
    title: 'Nope',
    author: 'ShouldNotExits',
    url: 'nothingimportant.com',
    likes: 1 
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUser = async ({ username, password }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash })
  await user.save()
  return user
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb, 
  usersInDb,
  createUser
}