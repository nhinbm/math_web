from flask import Flask, request, jsonify
from flask_cors import CORS

api = Flask(__name__)
CORS(api)

@api.route('/image', methods=['POST'])
def image():
  print(request.get_json())
  return {"message": "temp"}

if __name__ == "__main__":
  api.run(debug=True)