const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(filePath, mimeType) {

    if (mimeType === "application/pdf") {

        const buffer = fs.readFileSync(filePath);

        const data = await pdf(buffer);

        return data.text;
    }

    if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {

        const result = await mammoth.extractRawText({
            path: filePath,
        });

        return result.value;
    }

    if (mimeType === "text/plain") {

        return fs.readFileSync(filePath, "utf8");
    }

    throw new Error("Unsupported File");
}

module.exports = {
    extractText,
};