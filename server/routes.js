const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/User.js");
const authMiddleware = require("./middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("./model/File.js");
const { v4: uuidv4 } = require("uuid");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload file
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
      const newFile = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        owner: req.user.userId,
        accessCode,
      });
      await newFile.save();
      res.json({ message: "File uploaded successfully", accessCode });
    } catch (error) {
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

// Get user files
router.get("/files", authMiddleware, async (req, res) => {
  const files = await File.find({ owner: req.user.userId });
  res.json(files);
});

// Delete file
router.delete("/file/:id", authMiddleware, async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ message: "File deleted" });
});

router.post("/download", async (req, res) => {
  try {
    const { accessCode } = req.body;
    const file = await File.findOne({ accessCode });

    if (!file) return res.status(404).json({ error: "Invalid access code" });

    const filePath = file.filePath; // Ensure this is correct
    const fileName = file.originalName || "downloaded_file";

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ error: "File download failed" });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
