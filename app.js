const express = require("express");
const socket = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();

// Specify the directory for EJS templates
app.set("views", path.join(__dirname, "views"));

// Set up the view engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to the server
const io = socket(server);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send-locations", ({ latitude, longitude }) => {
    // Broadcast the location to all connected clients
    io.emit("received-locations", { id: socket.id, latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Notify all clients that a user has disconnected
    io.emit("user-disconnected", socket.id);
  });
});


// Start the server
server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
