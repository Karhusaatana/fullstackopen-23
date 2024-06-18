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
module.exports = {
  dummy, totalLikes, favoriteBlog
}