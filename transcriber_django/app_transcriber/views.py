from django.shortcuts import render
from .forms import TranscriptionForm
import openai
import os
from wordcloud import WordCloud
import matplotlib.pyplot as plt

def transcribe(request):
    if request.method == 'POST':
        form = TranscriptionForm(request.POST, request.FILES)
        if form.is_valid():
            openai_api_key = form.cleaned_data['openai_api_key']
            audio_file = form.cleaned_data['audio_file']
            model = form.cleaned_data['model']
            
            # Configurar la API de OpenAI
            openai.api_key = openai_api_key

            # Transcribir el archivo de audio
            audio_path = os.path.join('media', audio_file.name)
            with open(audio_path, 'wb+') as destination:
                for chunk in audio_file.chunks():
                    destination.write(chunk)
            
            # Llamada a Whisper para transcripción
            with open(audio_path, 'rb') as audio:
                transcript = openai.Audio.transcribe(model=model, file=audio)
            
            # Generar nube de palabras
            text = transcript['text']
            wordcloud = WordCloud().generate(text)

            # Guardar la imagen de la nube de palabras
            wordcloud_image_path = os.path.join('media', 'wordcloud.png')
            wordcloud.to_file(wordcloud_image_path)

            # Mostrar resultados
            return render(request, 'result.html', {'transcript': text, 'wordcloud_image': wordcloud_image_path})
    else:
        form = TranscriptionForm()
    
    return render(request, 'transcribe.html', {'form': form})
