import { OpenAIStream, OpenAIStreamPayload } from "@/lib/OpenAIStream"

export const runtime = "edge"

export async function POST(req: Request): Promise<Response> {
  const { prompt, input } = await req.json()

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 })
  }
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: JSON.stringify(input) },
    ],
    max_tokens: 1000,
    stream: true,
  }
  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
