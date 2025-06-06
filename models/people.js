const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    message: 'Name must be at least 3 characters long'
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'User phone number required'],
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
