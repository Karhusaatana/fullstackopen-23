const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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

beforeEach(async () =>{
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
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

test('post creates a new blog post', async () => {
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

  const response = await api.get('/api/blogs')
  
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
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

  const response = await api.get('/api/blogs')

  const likes = response.body[initialBlogs.length].likes
  
  assert.strictEqual(likes, 0)
})


after(async () => {
  await mongoose.connection.close()
})