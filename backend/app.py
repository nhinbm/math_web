from flask import Flask, request, make_response, jsonify, json, send_file
from flask_cors import CORS
from process import process_ocr
from audio import download_audio, transform_audio

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/process", methods=["POST"])
def process():
    raw_data = request.get_data(as_text=True)
    req = json.loads(raw_data)
    recognized_content = process_ocr(req)
    print(recognized_content)
    return {"message": recognized_content}


@app.route("/audio", methods=["POST"])
def process_sound():
    if "audio" not in request.files:
        return {"error": "No audio file provided"}, 400
    raw_data = request.files["audio"]
    audio_raw = raw_data.read()
    # Save the audio file
    download_audio(audio_raw)
    recognized_content = transform_audio()
    print(recognized_content)
    return {"message": recognized_content["text"]}


if __name__ == "__main__":
    app.run(debug=True)
