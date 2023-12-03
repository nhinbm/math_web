from flask import Flask
from flask_cors import CORS

api = Flask(__name__)
CORS(api)

@api.route('/', methods=["GET"])
def members():
  return {"members": ["Member1", "Member2", "Member3"]}

if __name__ == "__main__":
  api.run(debug=True)