const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs identifier is id not _id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog =>{
    assert('id' in blog)
    assert(!('_id' in blog))
  })
})

test('blog is added to db', async () => {
  const newPost = {
    title: 'News',
    author: 'Anchor',
    url: 'https://newsanchor',
    likes: 100
  }
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

test('missing likes property in post defaults to 0', async () => {
  const newPost = {
    title: 'Magic',
    author: 'Mike',
    url: 'https://magicmike'
  }
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const likes = blogsAtEnd[helper.initialBlogs.length].likes

  assert.strictEqual(likes, 0)
})
test('blog without title is not added', async () => {
  const newPost = {
    author: 'Mike',
    url: 'https://magicmike',
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})
test('blog without url is not added', async () => {
  const newPost = {
    title: 'Magic',
    author: 'Mike',
    likes: 100
  }

  await api
  .post('/api/blogs')
    .send(newPost)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


after(async () => {
  await mongoose.connection.close()
})