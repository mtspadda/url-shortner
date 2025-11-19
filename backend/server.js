const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const shorid = require("shortid");
const shortid = require("shortid");

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

await mongoose.connect(mongoUri);

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
});

const Url = mongoose.model("Url", urlSchema);

// TODO: Validate inputs
app.post("api/shorter", async (req, res) => {
  const { originalUrl } = req.body;
  const shortUrl = shortid.generate();
  const newUrl = new Url({ originalUrl, shortUrl });
  await newUrl.save();
  res.status(201).json({ originalUrl, shortUrl });
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (url) {
    return res.redirect(url.originalUrl);
  } else {
    return res.status(404).json("URL not found");
  }
});
