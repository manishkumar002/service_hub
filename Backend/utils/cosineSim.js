function cosineSim(a = [], b = []) {
  console.log("A length:", a.length);
  console.log("B length:", b.length);

  if (!a || !b || a.length !== b.length) {
    console.log("Length mismatch");
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += Number(a[i]) * Number(b[i]);
    normA += Number(a[i]) * Number(a[i]);
    normB += Number(b[i]) * Number(b[i]);
  }

  console.log("Dot:", dot);
  console.log("NormA:", normA);
  console.log("NormB:", normB);

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = cosineSim;
