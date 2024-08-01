import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [errorMessage, setErrorMessage] = useState(null)
  const [addMessage, setAddMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleNewBlogPost = async (event) => {
    event.preventDefault()
    try{
      const blogItem = {
        "title": newBlogTitle,
        "author": newBlogAuthor,
        "url": newBlogURL,
      }
      console.log("blog: ", blogItem)
      blogService
        .create(blogItem)
        .then(response => {
          setBlogs(blogs.concat(response))
          setNewBlogTitle('')
          setNewBlogAuthor('')
          setNewBlogURL('')
          setAddMessage(`a new blog ${newBlogTitle} by ${newBlogAuthor} added`)
          setTimeout(() => {
            setAddMessage(null)
          }, 3000)
        })
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>      
  )
  const addBlogForm = () => (
    <form onSubmit={handleNewBlogPost}>
      <div>
        title
        <input 
          type="text" 
          value={newBlogTitle} 
          name="Title"
          onChange={({ target }) => setNewBlogTitle(target.value)}
          required
        />
      </div>
      <div>
        author
        <input 
          type="text" 
          value={newBlogAuthor} 
          name="Author"
          onChange={({ target }) => setNewBlogAuthor(target.value)}
          required
        />
      </div>
      <div>
        url
        <input 
          type="text" 
          value={newBlogURL} 
          name="URL"
          onChange={({ target }) => setNewBlogURL(target.value)}
          required
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

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
      <h2>create new</h2>
      {addBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    
  )
}

export default App