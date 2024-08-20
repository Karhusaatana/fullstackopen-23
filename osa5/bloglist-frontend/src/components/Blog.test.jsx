import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { test, expect, vi, beforeEach } from 'vitest'
import Blog from './Blog'

let blog
let user

beforeEach(() => {
  blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Lester Tester',
    url: 'tester.fi',
    likes: 1,
    user: { name: 'Test User' }
  }

  user = {
    username: 'testuser'
  }
})

test('renders title', () => {
  render(<Blog blog={blog} user={user} />)

  screen.debug()

  const element = screen.getByText((title, element) => {
    return title.includes('Component testing is done with react-testing-library')
  })
  expect(element).toBeDefined()
})

test('renders author', () => {
  render(<Blog blog={blog} user={user} />)

  const element = screen.getByText((author, element) => {
    return author.includes('Lester Tester')
  })
  expect(element).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={user} handleLike={mockHandler} />
  )

  const userE = userEvent.setup()
  const viewButton = screen.getByText('view')
  await userE.click(viewButton)
  const likeButton = screen.getByText('like')
  await userE.click(likeButton)
  await userE.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const userE = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = container.querySelector('#title-input')
  const inputAuthor = container.querySelector('#author-input')
  const inputURL = container.querySelector('#url-input')
  const sendButton = screen.getByText('create')

  await userE.type(inputTitle, 'title1')
  await userE.type(inputAuthor, 'author1')
  await userE.type(inputURL, 'url.url')

  await userE.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title1')
  expect(createBlog.mock.calls[0][0].author).toBe('author1')
  expect(createBlog.mock.calls[0][0].url).toBe('url.url')
})