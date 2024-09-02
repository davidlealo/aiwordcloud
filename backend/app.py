import sys
import openai
import whisper
from wordcloud import WordCloud
import matplotlib.pyplot as plt

def transcribe_and_generate_wordcloud(api_key, audio_path):
    # Configura la API Key de OpenAI
    openai.api_key = api_key

    # Carga el modelo Whisper
    model = whisper.load_model("base")

    # Transcribe el audio
    result = model.transcribe(audio_path)
    transcription = result['text']

    # Genera la wordcloud
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(transcription)

    # Guarda la imagen de la wordcloud
    image_path = "wordcloud.png"
    wordcloud.to_file(image_path)

    return image_path

if __name__ == "__main__":
    api_key = sys.argv[1]
    audio_path = sys.argv[2]
    image_path = transcribe_and_generate_wordcloud(api_key, audio_path)
    print(image_path)
