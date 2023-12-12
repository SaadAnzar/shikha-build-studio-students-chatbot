"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudentInfoProps {
  studentName: string
  setStudentName: React.Dispatch<React.SetStateAction<string>>
  studentRollno: string
  setStudentRollno: React.Dispatch<React.SetStateAction<string>>
  studentGrade: string
  setStudentGrade: React.Dispatch<React.SetStateAction<string>>
}

const StudentInfoModal = ({
  studentName,
  setStudentName,
  studentRollno,
  setStudentRollno,
  studentGrade,
  setStudentGrade,
}: StudentInfoProps) => {
  const [open, setOpen] = useState(true)

  const handleCheck = () => {
    if (!studentName) {
      toast.warning("Please enter the name of the student.")
    } else if (studentName.length < 3) {
      toast.warning("The name must be at least 3 characters long.")
    } else if (!studentRollno) {
      toast.warning("Please enter the roll no. of the student.")
    } else if (!studentGrade) {
      toast.warning("Please enter the grade of the student.")
    } else {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Let's Learn</AlertDialogTitle>
          <AlertDialogDescription>
            Please fill the student info to be able to converse with the
            chatbot.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="studentname">Name</Label>
            <Input
              id="studentname"
              type="text"
              placeholder="Name of the student"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="studentrollno">Roll No.</Label>
            <Input
              id="studentrollno"
              type="text"
              placeholder="Roll no. of the student"
              value={studentRollno}
              onChange={(e) => setStudentRollno(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="grade">Grade</Label>
            <Select
              value={studentGrade}
              onValueChange={(value) => setStudentGrade(value)}
            >
              <SelectTrigger id="grade">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Grade 1">Grade 1</SelectItem>
                <SelectItem value="Grade 2">Grade 2</SelectItem>
                <SelectItem value="Grade 3">Grade 3</SelectItem>
                <SelectItem value="Grade 4">Grade 4</SelectItem>
                <SelectItem value="Grade 5">Grade 5</SelectItem>
                <SelectItem value="Grade 6">Grade 6</SelectItem>
                <SelectItem value="Grade 7">Grade 7</SelectItem>
                <SelectItem value="Grade 8">Grade 8</SelectItem>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <Button onClick={handleCheck}>Enter</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StudentInfoModal
