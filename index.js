require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('build'))
app.use(express.json())
morgan.token('type', function (req) { return JSON.stringify(req.body) })
app.use(morgan('tiny'))
app.use(morgan(':type'))
app.use(cors())

  
app.get('/api/persons/:id', (req, res, next) => {
  console.log('id',req.params.id)
  Person.findById(req.params.id)
    .then( person => {
      console.log('person =', person)
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch( error => next(error))
})

app.get('/api/persons', (_req, res) => {
  Person.find({}).then( persons => {
    res.json(persons)
  })
})

app.get('/info', (_req, res) => {
  console.log('testi',Date.now().toString())
  Person.find({}).then( persons => {
    const length = persons.length
    res.send( 
      `<p>This phonebook has info for ${length} people.</p>
        <p>${new Date().toUTCString()}</p>`
    )
  })
})

//Datan poistaminen
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then( () => {
      res.status(204).end()
    })
    .catch( error => next(error))
})

//Datan lisääminen
  
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch( error => next(error) )
})

//datan päivittäminen
app.put('/api/persons/:id', (req, res, next) => {

  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id, 
    { name, number}, 
    { new: true, runValidators: true, context: 'query'}
  )
    .then( updated => {
      res.json(updated)
    })
    .catch( error => next(error))
})

const errorHandler = (error, _req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send( { error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  
  
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
