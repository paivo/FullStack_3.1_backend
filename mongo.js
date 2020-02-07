const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://pave:${password}@cluster0-wzsgm.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length<4 ) {
    console.log('phonebook: ')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name+' '+person.number)
        })
        mongoose.connection.close()
    },
)} else {
    const generateId = () => {
        persons = Person.find({})
        const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
        return maxId + 1
    }

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        id: generateId(),
    })

    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}

