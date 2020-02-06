const express = require('express')
var morgan = require('morgan')

const app = express()
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
const cors = require('cors')

app.use(cors())

let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
    }
]
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '));

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    res.send('<div>Phonebook has info for '+persons.length+' people</div>'+ Date())
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)   
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()    
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
      return res.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return res.status(400).json({ 
          error: 'number missing' 
        })
      }
    names = persons.map(person => person.name)
    if (names.includes(body.name)) {
        return res.status(400).json({ 
          error: 'name must be unique' 
        })
    }
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
