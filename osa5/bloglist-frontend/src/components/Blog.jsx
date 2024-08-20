import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import userService from '../services/users'
import axios from 'axios'

const Blog = ({ blog, user, handleDeleteBlog, handleLike }) => {
  const [state, setState] = useState({
    visible: false,
    userId: null,
    blogOwner: blog.user ? blog.user.name : null,
  })

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const users = await userService.getAll()
        const filteredUser = users.find(u => u.username !== user.username)
        if (filteredUser) {
          setState(prevState => ({ ...prevState, userId: filteredUser.id }))
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Network error: Please check your connection.')
        } else {
          console.error('An unexpected error occurred.')
        }
      }
    }

    fetchUserId()
  }, [user.username])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setState(prevState => ({ ...prevState, visible: !prevState.visible }))
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {state.visible ? 'hide' : 'view'}
        </button>
      </div>
      {state.visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes
            <button onClick={handleLike}>
              like
            </button>
          </p>
          <p>added by {state.blogOwner}</p>
          {user.username === blog.user.username && (
            <button
              onClick={() => handleDeleteBlog(blog.id)}>
                remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog