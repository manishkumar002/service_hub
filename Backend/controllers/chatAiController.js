const { v4: uuid } = require("uuid");
const File = require("../models/file");
const Chunk = require("../models/Chunk");
const { getEmbedding } = require("../service/embeddingService");
const { extractText } = require("../service/parserService");
const chunkText = require("../utils/chunkText");
const cosineSim = require("../utils/cosineSim");
const { generateAnswer } = require("../service/geminiService");
const models = require("../service/collectionMap");
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileId = uuid();

    // 1. Extract text from uploaded file
    const extractedText = await extractText(req.file.path, req.file.mimetype);

    // 2. Create chunks
    const chunks = chunkText(extractedText);

    // 3. Save file details
    const file = await File.create({
      fileId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extractedText,
      chunksCount: chunks.length,
    });

    // 4. Save chunks (embedding baad me add karenge)
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i]);

      await Chunk.create({
        fileId,

        fileName: req.file.originalname,

        chunkIndex: i,

        text: chunks[i],

        embedding,
      });
    }

    return res.status(200).json({
      success: true,
      message: "File uploaded and chunks created successfully",
      totalChunks: chunks.length,
      data: file,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Question embedding
    const questionEmbedding = await getEmbedding(question);
    console.log("Question embedding length:", questionEmbedding.length);
    // Get all chunks
    const chunks = await Chunk.find();
    console.log("Chunk embedding length:", chunks[0].embedding.length);
    if (!chunks.length) {
      return res.status(404).json({
        success: false,
        message: "No document chunks found.",
      });
    }

    // Calculate similarity
    const scoredChunks = chunks.map((chunk) => ({
      text: chunk.text,
      score: cosineSim(questionEmbedding, chunk.embedding),
    }));

    // Sort descending
    scoredChunks.sort((a, b) => b.score - a.score);

    // Top 5 chunks
    const topChunks = scoredChunks.slice(0, 5);

    // Create context
    const context = topChunks.map((chunk) => chunk.text).join("\n\n");

    // Prompt for Gemini
    const prompt = `
You are an AI assistant.

Answer the user's question only using the context below.
If the answer is not available in the context, reply:
"I couldn't find the answer in the uploaded documents."

Context:
${context}

Question:
${question}

Answer:
`;

    // Generate answer from Gemini
    const answer = await generateAnswer(prompt);

    return res.status(200).json({
      success: true,
      question,
      answer,
      topChunks,
    });
  } catch (err) {
    console.error("Chat Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

exports.aiChat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await generateAnswer(question);

    return res.status(200).json({
      success: true,
      question,
      answer,
      source: "AI",
    });

  } catch (err) {
    console.error("AI Chat Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.aiSearch = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Gemini Prompt
    const prompt = `
You are an AI MongoDB Search Assistant.

Available Collections:

users
jobs
categories
payments
subscriptions
messages
conversations

User Question:
${question}

Return ONLY JSON.

Example:

{
 "collection":"users",
 "keyword":"Manish"
}

OR

{
 "collection":"jobs",
 "keyword":"Electrician Lucknow"
}
`;

    const aiResponse = await generateAnswer(prompt);

    const result = JSON.parse(
      aiResponse.replace(/```json|```/g, "").trim()
    );

    const model = models[result.collection];

    if (!model) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection returned by AI",
      });
    }

    // MongoDB Text Search
    const data = await model
      .find({
        $text: {
          $search: result.keyword,
        },
      })
      .limit(20);

    // Final AI Response
    const finalAnswer = await generateAnswer(`
User Question:
${question}

Database Result:
${JSON.stringify(data)}

Answer in simple English.
`);

    return res.json({
      success: true,
      collection: result.collection,
      keyword: result.keyword,
      answer: finalAnswer,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};