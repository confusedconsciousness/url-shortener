const mongoose = require("mongoose");

// we need some unique ids
const shortId = require("shortid");

const shortUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate,
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
