import whisper
import librosa
import numpy as np
from pedalboard.io import AudioFile
from pedalboard import *
import noisereduce as nr
import soundfile as sf


def transform_audio():
    model = whisper.load_model("small")
    result = model.transcribe("data/done/audio.wav", fp16=False)
    return result


def download_audio(audio_raw):
    audio_file_path = "data/raw/audio.wav"
    with open(audio_file_path, "wb") as file:
        file.write(audio_raw)


# def noise_reduction(threshold=20, alpha=1.5):
#     y, sr = librosa.load("data/raw/audio.wav")
#     # Apply dynamic range compression
#     y_drc = librosa.effects.preemphasis(y)
#     # Compute the short-time Fourier transform (STFT)
#     D = librosa.amplitude_to_db(np.abs(librosa.stft(y_drc)), ref=np.max)
#     # Identify noise threshold
#     threshold_value = np.max(D) - threshold
#     # Apply threshold to suppress noise
#     D_filtered = np.where(D < threshold_value, 0, D)
#     # Invert the STFT to obtain the denoised signal
#     y_denoised = librosa.griffinlim(librosa.db_to_amplitude(D_filtered))
#     y_denoised *= alpha
#     # Save the denoised audio
#     sf.write("data/done/audio.wav", y_denoised, sr, "PCM_24")


def noise_reduction(sr=44100):
    y, sr = librosa.load("data/raw/audio.wav")
    reduced_noise = nr.reduce_noise(y=y, sr=sr, stationary=True, prop_decrease=0.75)
    # Init type audio
    board = Pedalboard(
        [
            NoiseGate(threshold_db=-50, ratio=1.5, release_ms=250),
            Compressor(threshold_db=-16, ratio=2.5),
            LowShelfFilter(cutoff_frequency_hz=400, gain_db=10, q=1),
            Gain(gain_db=10),
        ]
    )
    # Process audio
    effected = board(reduced_noise, sr)
    sf.write("data/done/audio.wav", effected, sr, "PCM_24")
