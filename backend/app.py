from flask import Flask, request, make_response, jsonify, json
from flask_cors import CORS
from process import process_ocr

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/process', methods=['POST'])
def process():
    raw_data = request.get_data(as_text=True)
    req = json.loads(raw_data)

    recognized_content = process_ocr(req)
    print(recognized_content)
    
    return {"message": recognized_content}

@app.route('/audio', methods=['POST'])
def processAudio():
    raw_data = request.get_data(as_text=True)
    req = json.loads(raw_data)

    audio_blob = req["audio"]
    
    return {"message": "hello world"}

if __name__ == '__main__':
    app.run(debug=True)
