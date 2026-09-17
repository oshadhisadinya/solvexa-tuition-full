// src/app/dashboard/attendance/mark/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { toast } from 'sonner'

export default function MarkAttendancePage() {
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [status, setStatus] = useState('present')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Students list එක load කරගන්න
  useEffect(() => {
    const fetchStudents = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('students').select('*').order('name')
      if (data) setStudents(data)
    }
    fetchStudents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent) return alert('Please select a student')
    
    setLoading(true)
    const supabase = createClient()
    
    // ✅ Current User ගේ ID එක ගන්න
    const { data: { user } } = await supabase.auth.getUser()

    // Attendance record එක insert කිරීම
    const { error } = await supabase
      .from('attendance')
      .insert([{ 
        student_id: selectedStudent, 
        status,
        date: new Date().toISOString().split('T')[0], // Today's date
        user_id: user?.id  // ✅ user_id එක add කරන්න
      }])

    if (error) {
      alert('Error marking attendance: ' + error.message)
      setLoading(false)
    } else {
      alert('Attendance marked successfully!')
      router.push('/dashboard/attendance') // List page එකට යන්න
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-500 mt-1">Record student attendance for today.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student">Select Student</Label>
              <Select onValueChange={(value) => value && setSelectedStudent(value)} value={selectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.name} ({student.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => value && setStatus(value)} defaultValue="present">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
              <Button type="button" variant="outline" asChild className="w-full">
                <Link href="/dashboard/attendance">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}