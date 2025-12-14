import "dotenv/config";

// 🔁 MODEL PRIORITY ORDER
const MODELS = [
  "provider-2/gemini-2.5-flash-lite", // 🟢 First try
  "provider-1/deepseek-r1-0528",      // 🔵 Fallback
];

const getOpenAIAPIResponse = async (message) => {
  for (const model of MODELS) {
    try {
      const response = await fetch(
        "https://api.a4f.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 1800,
          }),
        }
      );

      const data = await response.json();

      // ❌ Model not available → try next
      if (data.error) {
        console.warn(`Model failed (${model}):`, data.error.message);
        continue;
      }

      // ✅ Success
      if (data.choices && data.choices.length) {
        return data.choices[0].message.content;
      }

    } catch (err) {
      console.warn(`Request failed (${model}):`, err.message);
    }
  }

  // ❌ All models failed
  return "AI service temporarily unavailable. Please try again later.";
};

export default getOpenAIAPIResponse;
