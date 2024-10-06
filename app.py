from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(app)


# Initialize Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Connect to MongoDB (Replace the connection string with your own)
# For local MongoDB, it could be: 'mongodb://localhost:27017/'
# For MongoDB Atlas, use your connection string from Atlas

FLASK_MONGODB_URL = os.getenv("FLASK_MONGODB_URL")
client = MongoClient(FLASK_MONGODB_URL)

# Choose the database and collection
db = client['LetterPosts']  # Replace 'letterDB' with your preferred database name
letters_collection = db['letters']  # Collection name
poems_collection = db['poems']  # Collection name

@app.route("/", methods=['GET'])
def render():
    return render_template("index.html")

# # API to get the letters
# @app.route("/letters", methods=['GET'])
# def get_letters():
#     letters = list(letters_collection.find({}, {'_id': 0}))
#     return jsonify(letters)

@app.route("/letters", methods=['GET'])
def get_letters():
    page = int(request.args.get('page', 1))  # Default to page 1
    limit = int(request.args.get('limit', 15))  # Default limit is 15

    # Total number of letters
    total_letters = letters_collection.count_documents({})
    
    # Total pages
    total_pages = (total_letters + limit - 1) // limit

    # Calculate the correct offset starting from the last element
    skip = max(total_letters - (page * limit), 0)

    # Fetch letters in reverse order (latest first) using skip and limit
    letters = list(
        letters_collection.find({}, {'_id': 0})
        .sort("time", 1)  # Sort by descending order of insertion (_id used as timestamp)
        .skip(skip)
        .limit(limit)
    )

    # Adjust the returned letters for the last page
    if page == total_pages:
        # If it's the last page, adjust the limit to fetch only the remaining letters
        remaining_letters_count = total_letters - (total_pages - 1) * limit
        letters = letters[:remaining_letters_count]  # Slice to return only the remaining letters


    return jsonify({
        'letters': letters,
        'total_pages': total_pages
    }    
)
# API to post a new letter
@app.route("/letters", methods=['POST'])
def post_letter():
    new_letter = request.json
    letters_collection.insert_one(new_letter)

    return jsonify({"message": "Letter added successfully!"}), 201

# api to get all poems
@app.route("/poems", methods=['GET'])
def get_poems():
    page = int(request.args.get('page', 1))  # Default to page 1
    limit = int(request.args.get('limit', 15))  # Default limit is 15

    # Total number of poems
    total_poems = poems_collection.count_documents({})
    
    # Total pages
    total_pages = (total_poems + limit - 1) // limit

    # Calculate the correct offset starting from the last element
    skip = max(total_poems - (page * limit), 0)

    # Fetch poems in reverse order (latest first) using skip and limit
    poems = list(
        poems_collection.find({}, {'_id': 0})
        .sort("time", 1)  # Sort by descending order of insertion (_id used as timestamp)
        .skip(skip)
        .limit(limit)
    )

    # Adjust the returned poems for the last page
    if page == total_pages:
        # If it's the last page, adjust the limit to fetch only the remaining poems
        remaining_poems_count = total_poems - (total_pages - 1) * limit
        poems = poems[:remaining_poems_count]  # Slice to return only the remaining poems


    return jsonify({
        'poems': poems,
        'total_pages': total_pages
    }    
)

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