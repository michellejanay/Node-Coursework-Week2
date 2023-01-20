const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

const welcomeMessage = {
  id: 1,
  from: 'Bart',
  text: 'Welcome to CYF chat system!',
}

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage]

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html')
  response.json(messages)
})

app.get('/messages', (request, response) => {
  response.json(messages)
})

app.get(`/messages/:id`, (request, response) => {
  let id = parseInt(request.params.id)
  let found = messages.some((message) => message.id === id)

  if (found) {
    response.json(messages.filter((message) => message.id === id))
  } else {
    response
      .status(400)
      .json({ msg: `Message id ${request.params.id} not found` })
  }
})

app.post('/messages', (request, response) => {
  const newMessage = request.body

  newMessage.id = messages.length + 1
  messages.push(newMessage)
  response.json(messages)
})

app.delete(`/messages/:id`, (request, response) => {
  const id = Number(request.params.id)
  let validator = messages.find((message) => message.id === id)

  validator === undefined && response.status(404).send('Not Found')

  const msgIndex = messages.findIndex((ind) => ind === messages.id)
  messages.splice(msgIndex, 1)
  response.send('Message deleted')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(PORT)
})
