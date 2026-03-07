import { getOpenAIClient } from './openai';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSION = 1536;
const MAX_TEXT_LENGTH = 8000;

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();

  const truncatedText = text.slice(0, MAX_TEXT_LENGTH);

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: truncatedText,
    dimensions: EMBEDDING_DIMENSION,
  });

  return response.data[0].embedding;
}

export async function generateBatchEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const client = getOpenAIClient();

  const batchSize = 100;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize).map((t) => t.slice(0, MAX_TEXT_LENGTH));

    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
      dimensions: EMBEDDING_DIMENSION,
    });

    results.push(...response.data.map((d) => d.embedding));
  }

  return results;
}

export function formatEmbeddingForPostgres(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}
