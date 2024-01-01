// import { OpenAIStream, OpenAIStreamPayload } from "@/lib/OpenAIStream"

// export const runtime = "edge"

// export async function POST(req: Request): Promise<Response> {
//   const { conversation, rubric } = await req.json()

//   if (!conversation) {
//     return new Response("No conversation was sent in the request!", {
//       status: 400,
//     })
//   }

//   const defaultRubric = `
//   1. Clarity of Communication
//   * 5: Excellent - Expresses ideas very clearly and coherently; precise and effective use of language.
//   * 4: Good - Clear and coherent for the most part; minor issues in expression.
//   * 3: Satisfactory - Generally understandable; occasional clarity or language issues.
//   * 2: Needs Improvement - Often unclear or incoherent; frequent errors in language.
//   * 1: Poor - Very unclear and difficult to comprehend; significant language issues.
//   2. Relevance of Queries and Responses
//   * 5: Excellent - Always on-topic; demonstrates a strong focus and understanding of the subject.
//   * 4: Good - Mostly relevant; minor deviations from the topic.
//   * 3: Satisfactory - Some relevant content but occasionally strays off-topic.
//   * 2: Needs Improvement - Frequently off-topic or irrelevant.
//   * 1: Poor - Mostly irrelevant or off-topic.
//   3. Depth of Inquiry
//   * 5: Excellent - Asks insightful, deep questions; demonstrates a high level of understanding.
//   * 4: Good - Questions show good depth and understanding.
//   * 3: Satisfactory - Some depth in questions; demonstrates basic understanding.
//   * 2: Needs Improvement - Questions are surface-level; limited depth.
//   * 1: Poor - Lacks depth; questions are very basic or superficial.
//   4. Critical Thinking and Problem-Solving
//   * 5: Excellent - Demonstrates high-level critical thinking and effective problem-solving skills.
//   * 4: Good - Shows good critical thinking and problem-solving abilities.
//   * 3: Satisfactory - Some evidence of critical thinking and basic problem-solving.
//   * 2: Needs Improvement - Limited critical thinking; struggles with problem-solving.
//   * 1: Poor - No evidence of critical thinking or problem-solving skills.
//   5. Engagement and Persistence
//   * 5: Excellent - Highly engaged and persistent; long and involved interactions.
//   * 4: Good - Generally engaged with good persistence.
//   * 3: Satisfactory - Some level of engagement and persistence.
//   * 2: Needs Improvement - Low engagement and limited persistence.
//   * 1: Poor - No real engagement or persistence.
//   6. Politeness and Communication Etiquette
//   * 5: Excellent - Always polite and adheres to communication norms.
//   * 4: Good - Mostly polite with minor lapses in communication etiquette.
//   * 3: Satisfactory - Generally polite but some noticeable issues.
//   * 2: Needs Improvement - Often impolite or disregards communication norms.
//   * 1: Poor - Regularly impolite and ignores communication etiquette.
//   Scoring Guide
//   * 26-30: Exceptional Interaction
//   * 21-25: Proficient Interaction
//   * 16-20: Adequate Interaction
//   * 11-15: Developing Interaction
//   * 6-10: Needs Improvement
//   * 1-5: Limited Interaction`

//   let input = `Rubric for evaluating a student on a conversation is as follows:\n\n`
//   if (rubric) {
//     input += `${rubric}\n\n`
//   } else {
//     input += defaultRubric + "\n\n"
//   }

//   input += `The chatbot conversation is as follows:\n\n${JSON.stringify(
//     conversation
//   )}\n\nPlease rate the child on the conversation based on the rubric.
//   Provide your response strictly as a JSON object of the following format and do not write anything else :-:

//     "ratingAnalysis": "Here comes the full analysis based on the conversation in text format. Give a score and a two-line description of each analysis.",
//     "ratingScore": "Here comes the overall conversation rating score out of 30.",
//     "ratingSummary": "Here comes the summary of the analysis of the conversation in 3-4 lines."

//   where, every key value in the JSON object should be strictly of type string with proper formatting.`

//   console.log("Input: ", input)

//   const payload: OpenAIStreamPayload = {
//     model: "gpt-3.5-turbo",
//     messages: [
//       { role: "system", content: "You are a useful chatbot." },
//       { role: "user", content: input },
//     ],
//     max_tokens: 1000,
//     stream: true,
//   }
//   const stream = await OpenAIStream(payload)
//   return new Response(stream)
// }

import { NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  try {
    const { conversation, rubric } = await req.json()

    if (!conversation) {
      return new Response("No conversation was sent in the request!", {
        status: 400,
      })
    }

    const defaultRubric = `
  1. Clarity of Communication
  * 5: Excellent - Expresses ideas very clearly and coherently; precise and effective use of language.
  * 4: Good - Clear and coherent for the most part; minor issues in expression.
  * 3: Satisfactory - Generally understandable; occasional clarity or language issues.
  * 2: Needs Improvement - Often unclear or incoherent; frequent errors in language.
  * 1: Poor - Very unclear and difficult to comprehend; significant language issues.
  2. Relevance of Queries and Responses
  * 5: Excellent - Always on-topic; demonstrates a strong focus and understanding of the subject.
  * 4: Good - Mostly relevant; minor deviations from the topic.
  * 3: Satisfactory - Some relevant content but occasionally strays off-topic.
  * 2: Needs Improvement - Frequently off-topic or irrelevant.
  * 1: Poor - Mostly irrelevant or off-topic.
  3. Depth of Inquiry
  * 5: Excellent - Asks insightful, deep questions; demonstrates a high level of understanding.
  * 4: Good - Questions show good depth and understanding.
  * 3: Satisfactory - Some depth in questions; demonstrates basic understanding.
  * 2: Needs Improvement - Questions are surface-level; limited depth.
  * 1: Poor - Lacks depth; questions are very basic or superficial.
  4. Critical Thinking and Problem-Solving
  * 5: Excellent - Demonstrates high-level critical thinking and effective problem-solving skills.
  * 4: Good - Shows good critical thinking and problem-solving abilities.
  * 3: Satisfactory - Some evidence of critical thinking and basic problem-solving.
  * 2: Needs Improvement - Limited critical thinking; struggles with problem-solving.
  * 1: Poor - No evidence of critical thinking or problem-solving skills.
  5. Engagement and Persistence
  * 5: Excellent - Highly engaged and persistent; long and involved interactions.
  * 4: Good - Generally engaged with good persistence.
  * 3: Satisfactory - Some level of engagement and persistence.
  * 2: Needs Improvement - Low engagement and limited persistence.
  * 1: Poor - No real engagement or persistence.
  6. Politeness and Communication Etiquette
  * 5: Excellent - Always polite and adheres to communication norms.
  * 4: Good - Mostly polite with minor lapses in communication etiquette.
  * 3: Satisfactory - Generally polite but some noticeable issues.
  * 2: Needs Improvement - Often impolite or disregards communication norms.
  * 1: Poor - Regularly impolite and ignores communication etiquette.
  Scoring Guide
  * 26-30: Exceptional Interaction
  * 21-25: Proficient Interaction
  * 16-20: Adequate Interaction
  * 11-15: Developing Interaction
  * 6-10: Needs Improvement
  * 1-5: Limited Interaction`

    let input = `Rubric for evaluating a student on a conversation is as follows:\n\n`
    if (rubric) {
      input += `${rubric}\n\n`
    } else {
      input += defaultRubric + "\n\n"
    }

    input += `The chatbot conversation is as follows:\n\n${JSON.stringify(
      conversation
    )}\n\nPlease rate the child on the conversation based on the rubric.
  Provide your response strictly as a JSON object of the following format and do not write anything else :-:

    "ratingAnalysis": "Here comes the full analysis based on the conversation in text format. Give a score and a two-line description of each analysis.",
    "ratingScore": "Here comes the overall conversation rating score out of 30.",
    "ratingSummary": "Here comes the summary of the analysis of the conversation in 3-4 lines."
  
  where, every key value in the JSON object should be strictly of type string with proper formatting.`

    console.log("Input: ", input)

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a useful chatbot.",
        },
        { role: "user", content: input },
      ],
      max_tokens: 1000,
    })

    console.log(response.data.choices[0].message?.content)
    return NextResponse.json(response.data.choices[0].message?.content)
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
