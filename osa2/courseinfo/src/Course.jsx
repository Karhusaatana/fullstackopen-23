const Course = (props) =>{
    const {course} = props
    const Header = () =>{
      return <h2>{course.name}</h2>
    }
    const Content = () =>{
      const Part = ({part}) =>{
        return(
          <div key={part.id}>{part.name} {part.exercises}</div>
        )
      }
      return(
        <div>
            {course.parts.map(part =>
              <Part key={part.id} part={part}/>
            )}
        </div>
      )
    }
    const Total = () =>{
      const ex = course.parts.map(part => part.exercises)
      const sum = ex.reduce((s,p) => s + p, 0)
      return(
        <div>
          <h3>total of {sum} exercises</h3>
        </div>
      )
    }
    
    return (
      <div>
        <Header/>
        <Content/>
        <Total/>
      </div>
    )
  }
export default Course