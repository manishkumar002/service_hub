async function safeParseJson(response) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (err) {
        throw new Error(text);
    }

}

module.exports = safeParseJson;