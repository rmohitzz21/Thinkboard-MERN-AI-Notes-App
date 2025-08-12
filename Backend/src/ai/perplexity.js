import axios from "axios";

export async function getSummaryFromPerplexity(noteContent) {
  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar", // Use an official supported model name you have access to
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: `Summarize this note briefly:\n\n${noteContent}` }
        ],
        max_tokens: 100,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      "Perplexity API request failed:",
      error.response?.data || error.message
    );
    return null;
  }
}
