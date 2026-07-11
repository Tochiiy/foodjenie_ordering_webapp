import axios from "axios"

export const generateRecipe = async (ingredients) => {
  const prompt = `Create a simple recipe using these ingredients: ${ingredients}

Format the response with:
- Recipe Name
- Ingredients list
- Step-by-step instructions
- Cooking time`

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 600,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      proxy: process.env.HTTP_PROXY ? (() => {
        const u = new URL(process.env.HTTP_PROXY)
        return { host: u.hostname, port: parseInt(u.port, 10), protocol: u.protocol, auth: u.username ? { username: u.username, password: u.password } : undefined }
      })() : undefined,
    }
  )

  return {
    recipe: response.data.choices[0].message.content,
    source: "Groq AI (LLaMA 3.1)",
  }
}
