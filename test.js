require("dotenv").config({ path: "./Backend/.env" });

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

(async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Say hello in one line",
    });

    console.log(response.text);
  } catch (err) {
    console.error("Status:", err.status);
    console.error(err);
  }
})();
