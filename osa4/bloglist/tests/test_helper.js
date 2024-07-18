const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}