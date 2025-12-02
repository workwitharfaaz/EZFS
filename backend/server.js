const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

let fileMap = {};

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  fileMap[code] = req.file.filename;

  res.json({ code });
});

app.get("/download/:code", (req, res) => {
  const filename = fileMap[req.params.code];
  if (!filename) return res.status(404).json({ error: "Invalid code" });

  const filePath = path.join(UPLOAD_DIR, filename);
  res.download(filePath, () => {
    delete fileMap[req.params.code];
    fs.unlink(filePath, () => {});
  });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
