const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/ShortUrl");
const app = express();

try {
  mongoose.connect(`${process.env.DATABASE_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.error({ error: error });
}

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

// /shortUrls will be called when the shorten button is pressed
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({
    originalUrl: req.body.originalUrl,
  });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  let shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
  if (shortUrl == null) {
    return res.status(404);
  }

  res.redirect(shortUrl.originalUrl);
});

app.listen(process.env.PORT || 5000);
