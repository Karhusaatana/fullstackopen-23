const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) =>{
  let sum = 0
  blogs.forEach(item =>{
    sum += item.likes
  })
  return sum
}
const favoriteBlog = (blogs) =>{
  if(blogs.length === 0){
    return null
  }
  if(blogs.length === 1){
    return blogs[0]
  }
  copy = [...blogs]
  copy.sort((a,b) => a.likes - b.likes)
  copy.reverse()
  return copy[0]
}
const mostBlogs = (blogs) =>{
  if(blogs.length == 0){
    return 0
  }
  authors = {}
  blogs.forEach(blog =>{
    if(authors[blog.author]){
      authors[blog.author] += 1
    } else{
      authors[blog.author] = 1
    }
  })
  const maxValue = Math.max(...Object.values(authors))
  const mostBlogsAuthor = Object.keys(authors).find(author => authors[author] === maxValue)
  return {"author": mostBlogsAuthor, "blogs":maxValue}
}
const mostLikes = (blogs) =>{
  if(blogs.length == 0){
    return 0
  }
  authors = {}
  blogs.forEach(blog =>{
    if(authors[blog.author]){
      authors[blog.author] += blog.likes
    } else{
      authors[blog.author] = blog.likes
    }
  })
  const maxValue = Math.max(...Object.values(authors))
  const mostLikesAuthor = Object.keys(authors).find(author => authors[author] === maxValue)
  return {"author": mostLikesAuthor, "likes":maxValue}
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}