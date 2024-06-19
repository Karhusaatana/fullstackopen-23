const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]
const listWithMoreBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a67623d17f9',
    title: 'Monkey mode',
    author: 'Tossavainen',
    url: 'blaablaa.pdf',
    likes: 4,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f3',
    title: 'Biggest Book',
    author: 'Huge Hughes',
    url: 'BigBook.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f4',
    title: 'Biggest Book2',
    author: 'Huge Hughes',
    url: 'BigBook2.pdf',
    likes: 1,
    __v: 0
  },
]
describe('total likes', () =>{
  test('of empty list is zero', () =>{
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () =>{
    const result = listHelper.totalLikes(listWithMoreBlogs)
    assert.strictEqual(result, 15)
  })
}),
describe('favourite blog', () =>{
  test('is the one with most likes', () =>{
    const result = listHelper.favoriteBlog(listWithMoreBlogs)
    assert.deepStrictEqual(result._id, listWithMoreBlogs[2]._id)
  })
  test('returns the latter blog when multiple most liked', () =>{
    const result = listHelper.favoriteBlog(listWithMoreBlogs)
    assert.deepStrictEqual(result._id, listWithMoreBlogs[2]._id)
  })
  test('when list has only one blog, is equal to the most liked', () =>{
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result._id, listWithOneBlog[0]._id)
  })
})
describe('most blogs', () =>{
  test('of empty list is zero', () =>{
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, 0)
  })
  test('is the author with most blogs', () =>{
    const result = listHelper.mostBlogs(listWithMoreBlogs)
    assert.deepStrictEqual(result.author, listWithMoreBlogs[2].author)
  })
  test('return the latter author when multiple have the most blogs', () =>{
    const result = listHelper.mostBlogs(listWithMoreBlogs)
    assert.deepStrictEqual(result.author, listWithMoreBlogs[2].author)
  })
})
describe('most likes author', () =>{
  test('of empty list is zero', () =>{
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, 0)
  })
  test('is the author with most likes', () =>{
    const result = listHelper.mostLikes(listWithMoreBlogs)
    assert.deepStrictEqual(result.author, listWithMoreBlogs[2].author)
  })
  test('return the latter author when multiple have the most blogs', () =>{
    const result = listHelper.mostLikes(listWithMoreBlogs)
    assert.deepStrictEqual(result.author, listWithMoreBlogs[2].author)
  })
})
