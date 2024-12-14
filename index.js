const express = require("express")
var morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

morgan.token('reqbody', function (req, res) { 
    if(req.method == 'POST')return JSON.stringify(req.body)
    else return null 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'))

let persons = 
[
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

const generateId = ()=> {
    const max = 1e9
    return String(Math.floor(Math.random() * max))
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info',(req, res) => {
    const date = Date()
    res.send(`Phonebook has info for ${persons.length} people <br/> ${date}`)
})

app.get('/api/persons/:id',(req, response) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    }else{
        response.statusMessage = "Person not in phonebook"
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request,response)=>{
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({
            error: "name or number missing"
        })
    }
    const repeated = persons.find(p => p.name === body.name)
    if(repeated){
        return res.status(400).json({
            error: "name already exists"
        })
    }
    const person = {
        id: generateId(),
        name : body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running at port 3001")
})
