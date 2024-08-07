import { useState } from "react"

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

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
        <div>likes {blog.likes} <button>like</button></div>
      </div>  
    )
  }
}

export default Blog