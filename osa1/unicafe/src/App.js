import { useState } from 'react'


const StatisticsLine = (props) =>{
  return(
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td> 
      <td>{props.percent}</td>
    </tr>
  )
} 
//Function to show statistics, if no stats given displays: 'No feedback given'
const Statistics = (props) =>{
  if (props.all === 0){
    return(
      <table>
        <tbody>
          <tr><td>No feedback given</td></tr>
        </tbody>
      </table>
    )
  }
  else{
    return(
      <table>
        <tbody>
          <StatisticsLine text="good" value={props.good}/>
          <StatisticsLine text="neutral" value={props.neutral}/>
          <StatisticsLine text="bad" value={props.bad}/>
          <StatisticsLine text="all" value={props.all}/>
          <StatisticsLine text="average" value={props.average}/>
          <StatisticsLine text="positives" value={props.positives} percent={'%'}></StatisticsLine>
        </tbody>
      </table>
    )
  }
}
const Button = ({handleClick, text}) =>{
  return(
    <button onClick={handleClick}>{text}</button>
  )
}
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)
  const [all, setAll] = useState(0)
  const [positives, setPositives] = useState(0)

  const handleGoodClick = () =>{
    const tmpGood = good+1
    const tmpAll = all+1
    setGood(tmpGood)
    setAll(tmpAll)
    setAverage((tmpGood-bad) / (tmpAll) )
    setPositives(tmpGood / tmpAll * 100)
  }
  const handleNeutralClick = () =>{
    const tmpNeutral = neutral+1
    const tmpAll = all+1
    setNeutral(tmpNeutral)
    setAll(tmpAll)
    setAverage((good-tmpAll) / (tmpAll) )
    setPositives(good / tmpAll * 100)
  }
  const handleBadClick = () =>{
    const tmpBad = bad+1
    const tmpAll = all+1
    setBad(tmpBad)
    setAll(tmpAll)
    setAverage((good-tmpBad) / (tmpAll) )
    setPositives(good / tmpAll * 100)
  }
  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={handleGoodClick} text="good"/>
      <Button handleClick={handleNeutralClick} text="neutral"/>
      <Button handleClick={handleBadClick} text="bad"/>
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} average={average} all={all} positives={positives} />
    </div>
  )
}

export default App