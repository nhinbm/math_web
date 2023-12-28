import whisper


def transform_audio():
    model = whisper.load_model("base")
    result = model.transcribe("data/audio.wav", fp16=False)
    return result


def download_audio(audio_raw):
    audio_file_path = "data/audio.wav"
    with open(audio_file_path, "wb") as file:
        file.write(audio_raw)
