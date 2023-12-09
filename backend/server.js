const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connect");
  })
  .catch((err) => {
    console.log(err);
  });

// Note Model
const Note = mongoose.model("Note", { text: String, done: Boolean });

// API Endpoints
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { text } = req.body;
    const { done } = req.body;
    const newNote = new Note({ text, done });
    await newNote.save();
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Note.findByIdAndUpdate(
      id,
      { done: true },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
