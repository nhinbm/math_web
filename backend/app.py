from flask import Flask, request, make_response, jsonify, json
from flask_cors import CORS
from process import process_ocr
from audio import transform_audio

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
    raw_data = request.json.get("audio")
    recognized_content = transform_audio(raw_data)

    print(recognized_content)
    return {"message": recognized_content}


if __name__ == "__main__":
    app.run(debug=False)
