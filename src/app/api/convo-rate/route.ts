import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { inputRating } = await req.json()

    if (!inputRating) {
      return new Response("No conversation was sent in the request!", {
        status: 400,
      })
    }

    const input = JSON.stringify(inputRating)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: input },
      ],
      response_format: { type: "json_object" },
    })

    console.log(completion.choices[0].message.content)
    return NextResponse.json(completion.choices[0].message?.content)
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
