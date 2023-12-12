import StudentChatbotPage from "@/components/student-chatbot-page"

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = params

  return <StudentChatbotPage id={id} />
}
