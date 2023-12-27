import { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css'

const Persons = (props) =>{
  return(
      <div>
        {props.persons.map(person => 
          <div key={person.id}>{person.name} {person.number} <button type="button" onClick={() => props.deleteClick(person.id, person.name)}>delete</button></div>
        )}
      </div>
  )
}
const Filter = (props) =>{
  return(
    <div>
        filter shown with <input value={props.value} onChange={props.onChange} />
    </div>
  )
}
const PersonForm = (props) =>{
  return(
    <form onSubmit={props.submit}>
        <div>
          name: <input value={props.name} onChange={props.nameChange}/>
        </div>
        <div>
          number: <input value={props.number} onChange={props.numberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}
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
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [addMessage, setAddMessage] = useState(null)

  useEffect(() =>{
    personService
      .getAll()
      .then(response =>{
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) =>{
    event.preventDefault()
    const list = persons.map((person) => person.name)
    if(list.includes(newName))
    {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find((person => person.name === newName))
        const changedPerson = {...person, number: newNumber}

        personService
          .update(changedPerson.id, changedPerson)
          .then(response =>{
            setPersons(persons.map(p => p.id !== changedPerson.id ? p : response.data))
            setNewName('')
            setNumber('')
          })
          setAddMessage(
            `Edited ${changedPerson.name}`
          )
          setTimeout(() => {
            setAddMessage(null)
          }, 3000)
      }
    }else{
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(response =>{
          setPersons(persons.concat(response.data))
          setNewName('')
          setNumber('')
        })
        setAddMessage(
          `Added ${personObject.name}`
        )
        setTimeout(() => {
          setAddMessage(null)
        }, 3000)
    }
  }
  
  const handleNameChange = (event) =>{
    event.preventDefault()
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) =>{
    event.preventDefault()
    setNumber(event.target.value)
  }
  const handleFilterChange = (event) =>{
    event.preventDefault()
    setFilter(event.target.value)
  }
  const handleDeleteClick = (id, name) =>{
    if(window.confirm(`Delete ${name}`)){
      personService
        .remove(id)
        .then(setPersons(persons.filter(p => p.id !== id)))
        .catch(error =>{
            setErrorMessage(
              `Person '${name}' is already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personToShow = !showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  
  return (
    <div>
      <h2>Phonebook</h2>

      <AddNotification message={addMessage}/>
      <ErrorNotification message={errorMessage}/>

      <Filter value={newFilter} onChange={handleFilterChange}/>
      
      <h3>add a new</h3>

      <PersonForm
        submit={addPerson} 
        name={newName} 
        nameChange={handleNameChange} 
        number={newNumber} 
        numberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>

      <Persons persons={personToShow} deleteClick={handleDeleteClick}/>
    </div>
  )
}

export default App
