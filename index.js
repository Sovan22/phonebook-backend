require('dotenv').config()

const People = require('./models/people')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('dist'))
const morgan = require('morgan')
morgan.token('type', function (req) { return req.headers['content-type'] })
app.use(express.json())

morgan.token('reqbody', function (req) { 
  if(req.method == 'POST')return JSON.stringify(req.body)
  else return null 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// let persons = 
// [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]



// const generateId = ()=> {
//     const max = 1e9
//     return String(Math.floor(Math.random() * max))
// }

app.get('/api/persons', (request, response, next) => {
  People.find({}).then(persons => {
    response.json(persons)
  }).catch(err => next(err))
  // response.json(persons)
})

app.get('/info',(req, res,next) => {
  const date = Date()
  People.find({}).then(persons => {
    res.send(`Phonebook has info for ${persons.length} people <br/> ${date}`)
  }).catch(err => next(err))
})

app.get('/api/persons/:id',(req, response,next) => {
  const id = req.params.id
  People.findById(id).then(person => {response.json(person)}).catch(err => next(err))

  // if(person){
  //     response.json(person)
  // }else{
  //     response.statusMessage = "Person not in phonebook"
  //     response.status(404).end()
  // }
})

app.delete('/api/persons/:id', (request,response,next)=>{
  const id = request.params.id
  People.findByIdAndDelete(id).then(result => {
    response.json(result)
    response.status(204).end()
  }).catch(err => next(err))

})

app.post('/api/persons', (req, res,next) => {
  const body = req.body
  if(!body.name || !body.number){
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new People({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(err => next(err))
    // const person = new People({
    //     name: body.name,
    //     number: body.number
    // })
    // person.save().then(savedPerson => {
    //     res.json(savedPerson)
    // }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  People.findById(id).then(person => {
    if(!person){
      return res.status(404).json({
        error: 'Person not found'
      })
    }
    person.number = body.number
    return person.save().then(updatedPerson => {
      res.json(updatedPerson)
    })
  }).catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
