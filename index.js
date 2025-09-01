const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => res.json(persons))

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people <br/> <br/> ${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id)
  person ? res.json(person) : res.status(404).json({ error: 'Person not found'})
})

app.delete('/api/persons/:id', (req, res) => {
  const initialLength = persons.length
  persons = persons.filter(p => p.id !== req.params.id)
  persons.length < initialLength ? res.status(204).end() : res.status(404).json({ error: 'Person not found' })
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name) return res.status(400).json({ error: 'Name is missing' })
  if (!number) return res.status(400).json({ error: 'Number is missing' })
  if (persons.some(p => p.name === name)) return res.status(400).json({ error: 'Name must be unique' })

  const newPerson = { id: Math.floor(Math.random() * 1000000).toString(), name, number }

  persons = persons.concat(newPerson)
  res.status(201).json(newPerson)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})