import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newURL, setNewURL] = useState('')
  const [newAuthor, setNewAuthor] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      url: newURL,
      author: newAuthor
    })

    setNewTitle('')
    setNewURL('')
    setNewAuthor('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={event => setNewTitle(event.target.value)}
            required
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newURL}
            name="URL"
            onChange={event => setNewURL(event.target.value)}
            required
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={event => setNewAuthor(event.target.value)}
            required
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default BlogForm