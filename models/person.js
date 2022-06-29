require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch((error) => {
        console.log('error connecting: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: function(v) {
              return /^\d{2,3}-/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
        required: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returedObject) => {
        returedObject.id = document.id.toString()
        delete returedObject._id
        delete returedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)