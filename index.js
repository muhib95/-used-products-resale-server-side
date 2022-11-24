const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT||5000
require('dotenv').config()



app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Worldnbbmbm!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})