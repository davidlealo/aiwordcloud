const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const app = express()
const port = process.env.PORT ?? 3000

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.use(cors())
app.use(express.json())

app.post('/transcribe', upload.single('audio'), (req, res) => {
    const apiKey = req.body.apiKey;
    const audioBuffer = req.file.buffer;
    const audioPath = path.join(__dirname, 'audio.mp3')

    // Guarda el archivo de audio temporalmente
    fs.writeFileSync(audioPath, audioBuffer)

    // Ejecuta el script Python para transcribir y generar la wordcloud
    const pythonProcess = spawn('python', ['app.py', apiKey, audioPath])

    pythonProcess.stdout.on('data', (data) => {
        res.json({ imageUrl: data.toString() })
    })

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`)
        res.status(500).send(data.toString())
    })

    pythonProcess.on('close', (code) => {
        console.log(`Process finished with code ${code}`)
        // Borra el archivo temporal
        fs.unlinkSync(audioPath);
    })
})

app.listen(port, () => {
    console.log(`Servidor está corriendo en http://localhost:${port}`)
})