const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    filePath: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
