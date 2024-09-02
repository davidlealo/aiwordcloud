const express = require('express')
const cors = require('cors')
const multer = require('multer')
const csvToJson = require('csvtojson')

const app = express()
const port = process.env.PORT ?? 3000

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.use(cors())

app.listen(port, () => {
    console.log(`Servidor está corriendo en http://localhost:${port}`)
})