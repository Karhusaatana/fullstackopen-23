import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Lester Tester',
    url: 'tester.fi',
    likes: 1,
    user: { name: 'Test User' }
  }

  const user = {
    username: 'testuser'
  }

  render(<Blog blog={blog} user={user} />)

  screen.debug()

  const element = screen.getByText((title, element) => {
    return title.includes('Component testing is done with react-testing-library')
  })
  expect(element).toBeDefined()
})

test('renders author', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Lester Tester',
    url: 'tester.fi',
    likes: 1,
    user: { name: 'Test User' }
  }

  const user = {
    username: 'testuser'
  }

  render(<Blog blog={blog} user={user} />)

  screen.debug()

  const element = screen.getByText((author, element) => {
    return author.includes('Lester Tester')
  })
  expect(element).toBeDefined()
})

test('clicking the view button shows blogs url and likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Lester Tester',
    url: 'tester.fi',
    likes: 1,
    user: { name: 'Test User' }
  }

  const user = {
    username: 'testuser'
  }
  let container = render(
    <Blog blog={blog} user={user}/>
  )

  const userE = userEvent.setup()
  const button = screen.getByText('view')
  await userE.click(button)

  expect(screen.getByText('tester.fi')).toBeInTheDocument()
  expect(screen.getByText('likes 1')).toBeInTheDocument()
})