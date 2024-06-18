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
    assert.strictEqual(result, 14)
  })
}),
describe('favourite blog', () =>{
  test('is the one with most likes', () =>{
    const result = listHelper.favoriteBlog(listWithMoreBlogs)
    console.log("result: ", result)
    assert.deepStrictEqual(result._id, listWithMoreBlogs[2]._id)
  })
  test('returns the latter blog when multiple most liked', () =>{
    const result = listHelper.favoriteBlog(listWithMoreBlogs)
    console.log("result: ", result)
    assert.deepStrictEqual(result._id, listWithMoreBlogs[2]._id)
  })
  test('when list has only one blog, is equal to the most liked', () =>{
    const result = listHelper.favoriteBlog(listWithOneBlog)
    console.log("result: ", result)
    assert.deepStrictEqual(result._id, listWithOneBlog[0]._id)
  })
})
