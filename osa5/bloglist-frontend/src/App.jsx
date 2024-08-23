import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

import './App.css'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [addMessage, setAddMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs(blogs)
      }
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLike = id => {
    console.log('handling like')
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: (blog.likes + 1) }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        setErrorMessage(
          `Blog '${blog.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  const AddNotification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className='add'>
        {message}
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      setUser(null)
      setUsername('')
      setPassword('')

    } catch (exception) {
      console.log(exception)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)

  const handleDeleteBlog = (id) => {
    if (window.confirm('Remove blog?')) {
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  if(user === null){
    return(
      <div>
        <h2>Log in to application</h2>

        <ErrorNotification message={errorMessage} />

        {loginForm()}
      </div>
    )
  }
  return(
    <div>
      <h2>blogs</h2>
      <AddNotification message={addMessage} />
      <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleDeleteBlog={handleDeleteBlog}
          handleLike={() => handleLike(blog.id)}
        />
      )}
    </div>
  )
}

export default App