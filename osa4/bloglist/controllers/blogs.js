const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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

blogsRouter.post('/', async (request, response) => {
  console.log("posting: ", request.token)

  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }
  const user = await User.findById(decodedToken.id)

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

blogsRouter.delete('/:id', async(request, response) =>{
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  console.log("token: ", decodedToken)

  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }
  const blog = await Blog.findById(request.params.id)
  const user = await User.findById(decodedToken.id)

  if (!(blog && user)){
    response.status(404).end()
  }
  
  if ( blog.user.toString() === user._id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).end()
  }
})


module.exports = blogsRouter