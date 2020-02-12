require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
const cors = require('cors')
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '));

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons.map(person => person.toJSON()))
    })
})
 app.get('/info', (req, res) => {
     Person.find({}).then(persons => {
        res.send('<div>Phonebook has info for '+persons.length+' people</div>'+ Date())
     })
 })
app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined) {
      return res.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
      return res.status(400).json({ error: 'number missing' })
    }
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save().then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
