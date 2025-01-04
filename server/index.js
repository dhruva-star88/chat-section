import express from "express";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import UserRoute from "./Routes/UserRoute.js"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"; 

const app = express();

// Use cors middleware
app.use(cors());

const PORT = process.env.PORT || 5000; // Default to 3000 if PORT isn't set

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use("/user", UserRoute)
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Failed to connect to MongoDB", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
