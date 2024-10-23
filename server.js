const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");


// Import the models
const Letter = require('./models/letterModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  res.header("Access-Control-Allow-Origin", process.env.BASE_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "it's working" });
});
app.use("/letters", require("./routes/letters"));
app.use("/poems", require("./routes/poems"));
// app.use("/trigger-message", require("./routes/message"))

// Create the HTTP server
const httpServer = createServer(app);

// Set up Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("newLetter", async (data) => {
    const newLetter = data.newLetter;
    const limit = data.limit;

    // Insert the new letter into the collection
    const letter = await Letter.create(newLetter)

    const totalLetters = await Letter.countDocuments({});
    const totalPages = Math.ceil(totalLetters / limit);

    // Broadcast the new letter to all connected clients
    io.emit("newLetter", { newLetter: letter, total_pages: totalPages });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
