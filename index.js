const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const ShortUrl = require("./models/ShortUrl");
const app = express();

require("dotenv").config();

mongoose.connection.on("connected", () => {
  console.log("Connection Established");
});

mongoose.connection.on("reconnected", () => {
  console.log("Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
  console.log("Connection Disconnected");
});

mongoose.connection.on("close", () => {
  console.log("Connection Closed");
});

mongoose.connection.on("error", (error) => {
  console.log("ERROR: " + error);
});

const run = async () => {
  await mongoose.connect(`${process.env.DATABASE_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

run()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`server listening on Port: ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

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
