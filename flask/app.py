from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import os
from bson import ObjectId
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

app = Flask(__name__)

CORS(app)


# Initialize Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Connect to MongoDB (Replace the connection string with your own)
# For local MongoDB, it could be: 'mongodb://localhost:27017/'
# For MongoDB Atlas, use your connection string from Atlas

FLASK_MONGODB_URL = os.getenv("FLASK_MONGODB_URL")
client = MongoClient(FLASK_MONGODB_URL, server_api=ServerApi('1'))

# Choose the database and collection
db = client['LetterPosts']  # Replace 'letterDB' with your preferred database name
letters_collection = db['letters']  # Collection name
poems_collection = db['poems']  # Collection name

letters_collection.create_index([("time", -1)])  # Index for letters collection
poems_collection.create_index([("time", -1)])    # Index for poems collection

@app.route("/", methods=['GET'])
def render():
    return render_template("index.html")

# API to get the letters
@app.route("/letters", methods=['GET'])
def get_letters_all():
    letters = list(letters_collection.find({}, {'_id': 0}).sort("time", -1))
    return jsonify({
        'letters': letters
    })


# API to post a new letter
@app.route("/letters", methods=['POST'])
def post_letter():
    new_letter = request.json
    letters_collection.insert_one(new_letter)

    return jsonify({"message": "Letter added successfully!"}), 201

# api to get all poems
@app.route("/poems", methods=['GET'])
def get_poems_all():
    poems = list(poems_collection.find({}, {'_id': 0}).sort("time", -1))
    return jsonify({
        'poems': poems
    })

# API to post a new poem
@app.route("/poems", methods=['POST'])
def post_poem():
    new_poem = request.json
    poems_collection.insert_one(new_poem)

    return jsonify({"message": "Poem added successfully!"}), 201



@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    
@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")

@socketio.on('newLetter')
def add_letter(data):
    newLetter = data["newLetter"]
    limit = data["limit"]
    # """event listener when client types a message"""
    letters_collection.insert_one(newLetter)
    
    total_letters = letters_collection.count_documents({})
    # Total pages
    total_pages = (total_letters + limit - 1) // limit
    
    del newLetter["_id"]
    # emit("newLetter", newLetter, broadcast=True)
    emit("newLetter", {"newLetter": newLetter, "total_pages": total_pages}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)