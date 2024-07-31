const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes || 0
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(201).json(updatedBlog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const userId = request.user
  const user = await User.findById(userId)

  if(body.title && body.url){
    const blog = new Blog({
      url: body.url,
      title: body.title, 
      author: body.author,
      user: user,
      likes: body.likes || 0
    })
    const savedPost = await blog.save()
    user.blogs = user.blogs.concat(savedPost._id)
    await user.save()
    response.status(201).json(savedPost)
  } else {
    response.status(400).end()
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async(request, response) =>{
  const blog = await Blog.findById(request.params.id)
  const userId = request.user

  if (!(blog && userId)){
    response.status(404).end()
  }
  
  if ( blog.user.toString() === userId) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).end()
  }
})


module.exports = blogsRouter