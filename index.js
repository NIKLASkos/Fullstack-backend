const http = require('http')
const express = require('express')
const { response } = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('build'))
app.use(express.json())
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('tiny'))
app.use(morgan(':type'))
app.use(cors())



let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-532344"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-123145"
    },
    {
      id: 4,
      name: "Mary Poppins",
      number: "39-9931222"
    },
  ]
  const length = persons.length
  
  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) res.json(person)
    else res.status(404).end()
  })

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    console.log('testi',Date.now().toString())
    res.send( 
        `<p>This phonebook has info for ${length} people.</p>
        <p>${new Date().toUTCString()}</p>`
    )
  })

  //Datan poistaminen
  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter( person => person.id !== id)

    res.status(204).end()
  })

  //Datan lisääminen
  app.post('/api/persons', (req, res) => {
    console.log('request headers', req.headers)
    const id = Math.floor(Math.random()*1000)
    const person = req.body

    if (!person.name || !person.number) {
      return res.status(400).json(
        { error: 'The person must have a name and a number'}
      )
    }
    if (persons.find(existingPerson => existingPerson.name === person.name)) {
      return res.status(400).json(
        { error: 'this person already exists' }
      )
    }
    person.id = id

    persons = persons.concat(person)
    res.json(person)
  })
  
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
