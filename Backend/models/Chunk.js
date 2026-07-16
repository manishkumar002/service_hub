const mongoose = require("mongoose");

const ChunkSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,
      index: true,
    },

    fileName: {
      type: String,
    },

    chunkIndex: {
      type: Number,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Chunk", ChunkSchema);
