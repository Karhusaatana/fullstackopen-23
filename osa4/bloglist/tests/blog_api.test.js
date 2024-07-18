const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const title = response.body.map(r => r.title)
    assert(title.includes('Monkey mode'))
  })

  test('blogs identifier is id not _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog =>{
      assert('id' in blog)
      assert(!('_id' in blog))
    })
  })
  
  describe('viewing a specific blog', () =>{

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })

  
  })

  describe('addition of a new blog post', () => {

    test('succeeds with valid data', async () => {
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

      const title = blogsAtEnd.map(b => b.title)
      assert(title.includes('News'))
    })

    test('with no likes property defaults to 0', async () => {
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

    test('without title fails with status code 400', async () => {
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

    test('without url fails with status code 400', async () => {
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
  })

  describe('deletetion of a blog post', () => {

    test('succeeds with status code 204 if id is valid', async () =>{
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const title = blogsAtEnd.map(r => r.title)
      assert(!title.includes(blogToDelete.title))
    })
  })
  describe('updating blog post', () =>{
    test('succeeds with status code 201 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
    
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .expect(201)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})