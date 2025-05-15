const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const encodedPassword = encodeURIComponent(password)
console.log(encodedPassword)

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length < 5) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    return mongoose.connection.close()

  }).then(() => {
    console.log('connection closed')
    process.exit(0)
  }).catch(err => {
    console.error('Error fetching persons:', err)
    process.exit(1)
  })
}
else{
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })
  person.save().then(result => {
    console.log(result)
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// Note.find({}).then(result => {
//   console.log('notes:')
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

// let note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
// })

// note = new Note({
//     content: "Mongoose makes Of mongo easy",
//     important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
// })

// note = new Note({
//     content : "Callback—functions suck" ,
//     important : false,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })