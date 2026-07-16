// const safeParseJson = require("../utils/safeParseJson");

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// exports.getEmbedding = async (text) => {
//   const response = await fetch("https://api.together.xyz/v1/embeddings", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${TOGETHER_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "togethercomputer/m2-bert-80M-32k-retrieval",
//       input: text,
//     }),
//   });

//   const data = await safeParseJson(response);

//   if (!response.ok) {
//     throw new Error(JSON.stringify(data));
//   }

//   return data.data[0].embedding;
// };

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.getEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return response.embeddings[0].values;
};
