import { useState, useEffect} from 'react'
import axios from 'axios'

const CountriesForm = (props) =>{
  return(
    <div>
      <form>
        <label>find countries</label><input type="text" onChange={props.onchange}/>
      </form>
    </div>
  )
}
const Country = (props) =>{
  return(
    <div>
      {props.name} <button type="button" onClick={() => props.onclick(props.name)}>show</button>
    </div>
  )
}
const ShowCountries = (props) =>{
  return(
    <div>
      {props.countries.map(country =>
        <Country key={country.name.common} name={country.name.common} onclick={props.onclick}/>
      )}
    </div>
  )
} 
const FilterCountries = (props) =>{
  if(props.countries.length > 10){
    return(
      <div>Too many matches, specify another filter</div>
    )
  }else if (props.countries.length == 1){
    const countryData = props.countries[0]
    console.log(countryData.name.common)
    return(
      <div>
        <h2>{countryData.name.common}</h2>
        <p>capital {countryData.capital}</p>
        <p>area {countryData.area}</p>
        <h4>languages:</h4>
        <ul>
          {Object.entries(countryData.languages).map(([code,name]) =>
            <li key={code}>{name}</li>
          )}
        </ul>
        <img src={countryData.flags.png} alt={countryData.flags.alt} />
      </div>
    )
  }else{
    return(
      <div>
        <ShowCountries countries={props.countries} onclick={props.onclick}/>
      </div>
    )
  }
}
function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountriesData] = useState([])
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
      console.log('fetching countries data...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          console.log(response.data)
          setCountriesData(response.data)
        })
  }, [])
  const handleFilterChange = (event) =>{
    event.preventDefault()
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  const handleCountryToShowClick = (name) =>{
    setFilter(name)
  }
  const countriesToShow = !showAll
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <CountriesForm onchange={handleFilterChange}/>
      <FilterCountries countries={countriesToShow} onclick={handleCountryToShowClick}/>
    </div>
  )
}

export default App
