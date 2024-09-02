from django import forms

class TranscriptionForm(forms.Form):
    openai_api_key = forms.CharField(widget=forms.PasswordInput, label="OpenAI API Key")
    audio_file = forms.FileField(label="Upload Audio File")
    model_choices = [
        ('whisper-1', 'Whisper-1'),
        ('whisper-2', 'Whisper-2'),  # Supongamos que hay múltiples versiones
    ]
    model = forms.ChoiceField(choices=model_choices, label="Select Model")
