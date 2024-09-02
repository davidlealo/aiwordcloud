const express = require('express');
const multer = require('multer');
const { Configuration, OpenAIApi } = require('openai');
const { createCanvas } = require('canvas');
const WordCloud = require('wordcloud');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    const apiKey = req.body.apiKey;
    const audioPath = req.file.path;

    const configuration = new Configuration({
        apiKey: apiKey,
    });

    const openai = new OpenAIApi(configuration);

    try {
        // Transcripción del audio
        const transcriptionResponse = await openai.createTranscription(
            fs.createReadStream(audioPath), // Necesitamos usar un stream
            "whisper-1",
            {
                language: "es"
            }
        );

        const text = transcriptionResponse.data.text;

        // Crear la nube de palabras
        const canvas = createCanvas(800, 600);
        const ctx = canvas.getContext('2d');

        WordCloud(ctx.canvas, {
            list: text.split(' ').map(word => [word, Math.random() * 10 + 1]),
            gridSize: Math.round(16 * 800 / 1024),
            weightFactor: function (size) {
                return Math.pow(size, 2.3) * 800 / 1024;
            },
            fontFamily: 'Times, serif',
            color: 'random-dark',
            backgroundColor: '#fff',
            rotateRatio: 0.5,
            rotationSteps: 2,
            drawOutOfBound: false,
            shuffle: true,
        });

        const imageUrl = canvas.toDataURL();

        // Eliminar el archivo temporal después de usarlo
        fs.unlink(audioPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo temporal:', err);
            }
        });

        res.json({ imageUrl });

    } catch (error) {
        console.error('Error al transcribir o generar la nube de palabras:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})