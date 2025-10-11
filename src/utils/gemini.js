// Utility function to normalize casual keywords (fallback if Gemini fails)
function normalizeQueryToGenre(prompt) {
  const map = {
    funny: "comedy",
    laugh: "comedy",
    jokes: "comedy",
    comedy: "comedy",
    humorous: "comedy",
    romantic: "romance",
    love: "romance",
    sex: "romance",
    girl: "romance",
    scary: "horror",
    spooky: "horror",
    horror: "horror",
    ghost: "horror",
    zombie: "horror",
    haunted: "horror",
    action: "action",
    adventure: "action",
    exciting: "action",
    psychological: "thriller",
    thriller: "thriller",
    suspense: "thriller",
    fighting: "action",
    battle: "action",
    war: "action",
    fiction: "science fiction",
    futuristic: "science fiction",
    alien: "science fiction",
    space: "science fiction",
    sci: "science fiction",
    drama: "drama",
    sad: "drama",
  };

  const lowerPrompt = prompt.toLowerCase();
  for (const [keyword, genre] of Object.entries(map)) {
    if (lowerPrompt.includes(keyword)) return genre;
  }
  return null;
}

// Main function to call Gemini and process the result
export async function getMovieQueryFromGemini(prompt) {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  if (!prompt) return { query: "", titles: [], genres: [] };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a helpful assistant that translates user movie queries into search metadata for TMDB.

Your task is to:
- Normalize casual words like "funny" to proper genres like "comedy"
- Output a valid JSON object ONLY in this format:
{
  "query": "<main search term like 'comedy'>",
  "genres": ["<TMDB genre like 'comedy'>"],
  "titles": ["<some popular movies that match the type>"]
}

Examples:
- "funny movies" => comedy
- "scary stuff" => horror
- "romantic love stories" => romance
- "action packed thrillers" => action

No extra text. Just return the JSON only.

Input: "${prompt}"
Output:
                  `.trim(),
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini error ${response.status}`);

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Extract JSON block safely even if Gemini wraps it in markdown/code
    const jsonMatch = rawText?.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in Gemini response");

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      query: parsed.query || prompt,
      genres: Array.isArray(parsed.genres) ? parsed.genres : [],
      titles: Array.isArray(parsed.titles) ? parsed.titles : [],
    };
  } catch (err) {
    console.warn("Gemini request failed or returned invalid JSON:", err);

    // Optional fallback using simple keyword-to-genre mapping
    const fallbackGenre = normalizeQueryToGenre(prompt);

    return {
      query: fallbackGenre || prompt,
      genres: fallbackGenre ? [fallbackGenre] : [],
      titles: [],
    };
  }
}
