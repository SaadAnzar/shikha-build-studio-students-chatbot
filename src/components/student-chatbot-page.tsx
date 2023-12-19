"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { Grid } from "react-loader-spinner"
import { toast } from "sonner"

import { db } from "@/config/firebase"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import MarkdownComponent from "@/components/MarkdownComponent"
import Loader from "@/components/loader"
import StudentInfoModal from "@/components/student-info-modal"

interface ChatbotProps {
  imageURL: string
  chatbotName: string
  welcomeMessage: string
  description: string
  namespace: string
  indexName: string
  tags: string
  prompt: string
}

interface Chat {
  role: "user" | "assistant"
  content: string
}

interface StudentChatbotPageProps {
  id: string
}

export default function StudentChatbotPage({ id }: StudentChatbotPageProps) {
  const [chatbotDetails, setChatbotDetails] = useState<any>({} as ChatbotProps)
  const [chatbotLoading, setChatbotLoading] = useState<boolean>(true)
  const [notExists, setNotExists] = useState<boolean>(false)

  const [studentName, setStudentName] = useState<string>("")
  const [studentRollno, setStudentRollno] = useState<string>("")
  const [studentGrade, setStudentGrade] = useState<string>("")

  const [convoRating, setConvoRating] = useState<string>("")

  const [ratingLoading, setRatingLoading] = useState<boolean>(false)

  const [saveLoading, setSaveLoading] = useState<boolean>(false)

  const {
    imageURL,
    chatbotName,
    welcomeMessage,
    namespace,
    indexName,
    prompt,
  }: ChatbotProps = {
    ...chatbotDetails,
  }

  const [input, setInput] = useState<string>("")
  const [chats, setChats] = useState<Chat[]>([
    { role: "assistant", content: welcomeMessage },
  ])
  const [questions, setQuestions] = useState<string>("")
  const [answer, setAnswer] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const scrollAreaRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    const getChatbotDetails = async () => {
      try {
        const docRef = doc(db, "chatbots", id)

        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setChatbotDetails(docSnap.data())
          setChatbotLoading(false)
          setNotExists(false)
        } else {
          setChatbotLoading(false)
          setNotExists(true)
        }
      } catch (error) {
        console.log(error)
        setChatbotLoading(false)
      }
    }

    if (id) {
      setChatbotLoading(true)
      getChatbotDetails()
      setTimeout(() => {
        setChatbotLoading(false)
      }, 2000)
    }
  }, [id])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [chats])

  useEffect(() => {
    setChats([{ role: "assistant", content: welcomeMessage }])
  }, [welcomeMessage])

  const handlePromptSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const currentChat: Chat = {
      role: "user",
      content: input,
    }

    let conversationHistory: Chat[] = []

    const lastChat = chats[chats.length - 1]
    const secondLastChat = chats[chats.length - 2]
    const thirdLastChat = chats[chats.length - 3]

    if (!secondLastChat) {
      conversationHistory = [lastChat, currentChat]
    } else if (!thirdLastChat) {
      conversationHistory = [secondLastChat, lastChat, currentChat]
    } else {
      conversationHistory = [
        thirdLastChat,
        secondLastChat,
        lastChat,
        currentChat,
      ]
    }

    setChats([...chats, { role: "user", content: input }])
    setIsLoading(true)

    const response = await fetch("/api/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, input: conversationHistory }),
    })

    const data = response.body
    if (!data) {
      console.log("No data")
      return
    }

    if (!response.ok) {
      setChats([
        ...chats,
        { role: "user", content: input },
        {
          role: "assistant",
          content:
            "Sorry, We ran into an error. Please refresh the page and try again.",
        },
      ])
      setInput("")
      setIsLoading(false)
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    let output = ""

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      output += chunkValue
      setChats([
        ...chats,
        {
          role: "user",
          content: input,
        },
        {
          role: "assistant",
          content: output as string,
        },
      ])
    }

    setInput("")
    setIsLoading(false)
  }

  const handleQuestions = () => {
    let updatedQuestions = ""
    if (questions === "") {
      updatedQuestions = input + " | "
      setQuestions(updatedQuestions)
    } else {
      updatedQuestions = questions + input + " | "
      setQuestions(updatedQuestions)
    }
    return updatedQuestions
  }

  const handleDataSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const response = handleQuestions()
    setQuestions(response)
    setChats([...chats, { role: "user", content: input }])
    setIsLoading(true)

    const res = await fetch(
      `https://langchainchatbot-64e6d01e9116.herokuapp.com/Chat?query=${input}&namespace=${namespace}&index_name=${indexName}&questions=${questions}&answers=${answer}`,
      {
        method: "POST",
      }
    )
    const body = await res.json()
    const Answer = body.response

    setChats([
      ...chats,
      {
        role: "user",
        content: input,
      },
      {
        role: "assistant",
        content: Answer,
      },
    ])
    setInput("")
    let updatedAnswers = ""
    if (answer === "") {
      updatedAnswers = Answer + " | "
      setAnswer(updatedAnswers)
    } else {
      updatedAnswers = answer + Answer + " | "
      setAnswer(updatedAnswers)
    }
    setIsLoading(false)

    if (!res.ok) {
      setChats([
        ...chats,
        { role: "user", content: input },
        {
          role: "assistant",
          content:
            "Sorry, Your document is not in the index. Please upload a new document.",
        },
      ])
      setInput("")
      setIsLoading(false)
    }
  }

  const rateConversation = async () => {
    if (chats.length < 5) {
      toast.error("The length of the chats should be minimum 5.")
    } else {
      setConvoRating("")
      setRatingLoading(true)

      const response = await fetch("/api/convo-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation: chats }),
      })

      const data = response.body
      if (!data) {
        console.log("No data")
        return
      }

      if (!response.ok) {
        toast.error("Sorry, We ran into an error. Please try again.")
        setRatingLoading(false)
      }

      const reader = data.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)

        setConvoRating((prev) => prev + chunkValue)
      }

      setRatingLoading(false)
    }
  }

  const saveConversation = async () => {
    if (chats.length < 5) {
      toast.error("The length of the chats should be minimum 5.")
    } else {
      try {
        setSaveLoading(true)

        await addDoc(collection(db, "responses"), {
          studentName,
          studentRollno,
          studentGrade,
          convoRating,
          chatbotDetails,
          chats,
          createdAt: serverTimestamp(),
        })
        setSaveLoading(false)
        toast.success("Your conversation has been saved.")
        setChats([{ role: "assistant", content: welcomeMessage }])
        setConvoRating("")
      } catch (error) {
        console.log(error)
        setSaveLoading(false)

        toast.error("Something went wrong!")
      }
    }
  }

  if (chatbotLoading) return <Loader />

  if (notExists)
    return (
      <div className="my-auto flex h-screen items-center justify-center text-center">
        <div className="text-center text-lg font-semibold">
          The chatbot you are looking for does not exist.
          <p className="py-2" />
          Please check if the URL is correct.
        </div>
      </div>
    )

  return (
    <>
      <StudentInfoModal
        studentName={studentName}
        setStudentName={setStudentName}
        studentRollno={studentRollno}
        setStudentRollno={setStudentRollno}
        studentGrade={studentGrade}
        setStudentGrade={setStudentGrade}
      />
      <div className="flex h-screen w-full items-center justify-center space-x-8">
        <div className="w-[60%]">
          <Card className="w-full rounded-xl shadow-xl">
            <CardHeader>
              <CardTitle className="font-cal tracking-normal">
                {chatbotName ? chatbotName : "Shikha AI"}
              </CardTitle>
              <CardDescription className="leading-3">
                Powered by{" "}
                <Link
                  href="https://trypolymath.ai"
                  className="text-primary font-semibold underline"
                >
                  Polymath AI
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={scrollAreaRef}
                className="h-[430px] w-full overflow-y-auto pr-4"
              >
                {chats.map((chat, index) => (
                  <div
                    key={index}
                    className="my-4 flex flex-1 gap-3 text-sm text-gray-600"
                  >
                    {chat.role === "user" && (
                      <Avatar>
                        <div className="bg-primary flex h-full w-full items-center justify-center rounded-full border opacity-100">
                          <svg
                            className="w-full rounded-full"
                            stroke="none"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            width="20"
                            viewBox="0 0 448 512"
                          >
                            <path d="M370.7 96.1C346.1 39.5 289.7 0 224 0S101.9 39.5 77.3 96.1C60.9 97.5 48 111.2 48 128v64c0 16.8 12.9 30.5 29.3 31.9C101.9 280.5 158.3 320 224 320s122.1-39.5 146.7-96.1c16.4-1.4 29.3-15.1 29.3-31.9V128c0-16.8-12.9-30.5-29.3-31.9zM336 144v16c0 53-43 96-96 96H208c-53 0-96-43-96-96V144c0-26.5 21.5-48 48-48H288c26.5 0 48 21.5 48 48zM189.3 162.7l-6-21.2c-.9-3.3-3.9-5.5-7.3-5.5s-6.4 2.2-7.3 5.5l-6 21.2-21.2 6c-3.3 .9-5.5 3.9-5.5 7.3s2.2 6.4 5.5 7.3l21.2 6 6 21.2c.9 3.3 3.9 5.5 7.3 5.5s6.4-2.2 7.3-5.5l6-21.2 21.2-6c3.3-.9 5.5-3.9 5.5-7.3s-2.2-6.4-5.5-7.3l-21.2-6zM112.7 316.5C46.7 342.6 0 407 0 482.3C0 498.7 13.3 512 29.7 512H128V448c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64l98.3 0c16.4 0 29.7-13.3 29.7-29.7c0-75.3-46.7-139.7-112.7-165.8C303.9 338.8 265.5 352 224 352s-79.9-13.2-111.3-35.5zM176 448c-8.8 0-16 7.2-16 16v48h32V464c0-8.8-7.2-16-16-16zm96 32a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
                          </svg>
                        </div>
                      </Avatar>
                    )}
                    {chat.role === "assistant" && !imageURL && (
                      <Avatar>
                        <div
                          className={cn(
                            "bg-primary flex h-full w-full items-center justify-center rounded-full border opacity-100",
                            isLoading && "animate-pulse"
                          )}
                        >
                          <svg
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                          >
                            <path
                              fill="white"
                              d="M18.5 10.255c0 .044 0 .089-.003.133A1.537 1.537 0 0 0 17.473 10c-.162 0-.32.025-.473.074V5.75a.75.75 0 0 0-.75-.75h-8.5a.75.75 0 0 0-.75.75v4.505c0 .414.336.75.75.75h8.276l-.01.025l-.003.012l-.45 1.384l-.01.026a1.625 1.625 0 0 1-.019.053H7.75a2.25 2.25 0 0 1-2.25-2.25V5.75A2.25 2.25 0 0 1 7.75 3.5h3.5v-.75a.75.75 0 0 1 .649-.743L12 2a.75.75 0 0 1 .743.649l.007.101l-.001.75h3.5a2.25 2.25 0 0 1 2.25 2.25v4.505Zm-5.457 3.781l.112-.036H6.254a2.25 2.25 0 0 0-2.25 2.25v.907a3.75 3.75 0 0 0 1.305 2.844c1.563 1.343 3.802 2 6.691 2c2.076 0 3.817-.339 5.213-1.028a1.545 1.545 0 0 1-1.169-1.003l-.004-.012l-.03-.093c-1.086.422-2.42.636-4.01.636c-2.559 0-4.455-.556-5.713-1.638a2.25 2.25 0 0 1-.783-1.706v-.907a.75.75 0 0 1 .75-.75H12v-.003a1.543 1.543 0 0 1 1.031-1.456l.012-.005ZM10.999 7.75a1.25 1.25 0 1 0-2.499 0a1.25 1.25 0 0 0 2.499 0Zm3.243-1.25a1.25 1.25 0 1 1 0 2.499a1.25 1.25 0 0 1 0-2.499Zm1.847 10.912a2.831 2.831 0 0 0-1.348-.955l-1.377-.448a.544.544 0 0 1 0-1.025l1.377-.448a2.84 2.84 0 0 0 1.76-1.762l.01-.034l.449-1.377a.544.544 0 0 1 1.026 0l.448 1.377a2.837 2.837 0 0 0 1.798 1.796l1.378.448l.027.007a.544.544 0 0 1 0 1.025l-1.378.448a2.839 2.839 0 0 0-1.798 1.796l-.447 1.377a.55.55 0 0 1-.2.263a.544.544 0 0 1-.827-.263l-.448-1.377a2.834 2.834 0 0 0-.45-.848Zm7.694 3.801l-.765-.248a1.577 1.577 0 0 1-.999-.998l-.249-.765a.302.302 0 0 0-.57 0l-.249.764a1.577 1.577 0 0 1-.983.999l-.766.248a.302.302 0 0 0 0 .57l.766.249a1.576 1.576 0 0 1 .998 1.002l.25.764a.303.303 0 0 0 .57 0l.248-.764a1.575 1.575 0 0 1 1-.999l.765-.248a.302.302 0 0 0 0-.57l-.016-.004Z"
                            />
                          </svg>
                        </div>
                      </Avatar>
                    )}
                    {chat.role === "assistant" && imageURL && (
                      <Avatar className="h-10 w-10">
                        <div className="flex h-full w-full items-center justify-center rounded-full border">
                          <Image
                            src={imageURL}
                            alt="Chatbot Icon"
                            width={30}
                            height={30}
                            className="rounded-full"
                          />
                        </div>
                      </Avatar>
                    )}

                    <div className="leading-relaxed">
                      <span className="font-cal block text-base tracking-normal text-black">
                        {chat.role === "user" ? "You" : chatbotName}
                      </span>
                      <div className="text-primary mt-1 rounded-lg bg-zinc-200 px-4 py-1.5 font-medium">
                        <MarkdownComponent content={chat.content} />
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-primary inline-block rounded-lg p-2 px-2.5">
                    <Grid
                      height={15}
                      width={15}
                      radius={10}
                      ariaLabel="grid-loading"
                      color="#fff"
                      ms-visible={true}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={indexName ? handleDataSubmit : handlePromptSubmit}
                className="flex w-full items-center justify-center space-x-2"
              >
                <Input
                  placeholder="Type your message"
                  autoFocus
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value.charAt(0).toUpperCase() +
                        event.target.value.slice(1)
                    )
                  }
                />
                <Button disabled={isLoading || !input}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Grid
                        height={15}
                        width={15}
                        radius={10}
                        ariaLabel="grid-loading"
                        color="#fff"
                        ms-visible={true}
                      />
                      <span className="text-base tracking-normal">Loading</span>
                    </div>
                  ) : (
                    <span className="text-lg tracking-normal">Send</span>
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
        <div className="w-[30%]">
          <Card className="mx-1 mb-2 flex flex-col items-center justify-between rounded-xl p-2 font-medium shadow-md">
            <h1 className="text-lg font-semibold">
              {studentName ? studentName : "Shikha AI Chatbot"}
            </h1>
          </Card>
          <Card className="rounded-xl drop-shadow-2xl">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Save Conversation</CardTitle>
              <CardDescription>
                Click on end conversation to save the chats.
                <br />
                Also get the rating on how you did with the convo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Button
                  onClick={rateConversation}
                  disabled={ratingLoading || saveLoading}
                >
                  {ratingLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating
                    </>
                  ) : (
                    "Evaluate"
                  )}
                </Button>
              </div>

              <Card className="mt-4 h-[280px] overflow-y-auto rounded-xl px-3 py-2 text-sm shadow">
                <MarkdownComponent content={convoRating} />
              </Card>
            </CardContent>
            <CardFooter>
              <Button
                onClick={saveConversation}
                disabled={saveLoading || ratingLoading}
                className="w-full"
              >
                {saveLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                End Conversation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
