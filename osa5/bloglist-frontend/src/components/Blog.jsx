import { useState, useEffect } from "react"
import blogService from '../services/blogs'
import userService from '../services/users'

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    userService
        .getAll()
        .then(users => setUserId(users.filter(u => u.username !== user.username)[0].id))
  }, [])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = async () => {
    try{
      blogService
        .update(blog.id, {
          user: userId,
          likes: likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url
        })
        .then(response => setLikes(response.likes))
    }catch (exception) {
      console.log(exception)
    }
  }
  
  if(!visible){
    return(
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>likes {likes} <button onClick={addLike}>like</button></div>
        <div>{user.name}</div>
      </div>  
    )
  }
}

export default Blog