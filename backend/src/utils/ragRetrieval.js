/**
 * RAG-lite retrieval: splits long study text into chunks, then ranks
 * chunks by how relevant they are to the topic/question being asked,
 * using simple keyword-overlap scoring (no paid embedding API needed).
 *
 * Why this approach: a vector database is overkill for "a student pastes
 * one chapter." This keeps retrieval free, fast, and crash-proof, while
 * still solving the real problem — not overwhelming the AI with irrelevant
 * text when notes are very long.
 */

const CHUNK_SIZE_WORDS = 350; // roughly one paragraph-ish unit
const MAX_CHUNKS_TO_USE = 6; // caps how much text we ever send to the AI

/**
 * Splits text into word-based chunks.
 */
export const chunkText = (text) => {
  const words = text.trim().split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += CHUNK_SIZE_WORDS) {
    chunks.push(words.slice(i, i + CHUNK_SIZE_WORDS).join(" "));
  }

  return chunks;
};

/**
 * Scores how relevant a chunk is to a query using simple keyword overlap.
 * This is a lightweight stand-in for embedding similarity —
 * it counts how many meaningful query words appear in the chunk.
 */
const scoreChunk = (chunk, queryWords) => {
  const chunkLower = chunk.toLowerCase();
  let score = 0;
  for (const word of queryWords) {
    if (word.length < 3) continue; // skip tiny words like "is", "a"
    const occurrences = chunkLower.split(word).length - 1;
    score += occurrences;
  }
  return score;
};

/**
 * Main retrieval function.
 * Given the full study text and a topic/query, returns the most relevant
 * chunks joined together — ready to drop into the AI prompt.
 *
 * If the text is short enough already, we skip ranking entirely and
 * just return everything (no point ranking 2 chunks).
 */
export const retrieveRelevantContext = (studyText, topic) => {
  if (!studyText || studyText.trim().length === 0) {
    return "";
  }

  const chunks = chunkText(studyText);

  // Short text — just use it all, no need to filter
  if (chunks.length <= MAX_CHUNKS_TO_USE) {
    return chunks.join("\n\n");
  }

  const queryWords = (topic || "").toLowerCase().split(/\s+/);

  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryWords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CHUNKS_TO_USE)
    .map((item) => item.chunk);

  return ranked.join("\n\n");
};
