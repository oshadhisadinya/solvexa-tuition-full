// src/app/dashboard/fees/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewFeePage() {
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [amount, setAmount] = useState('')
  const [paidDate, setPaidDate] = useState('')
  const [month, setMonth] = useState('')
  const [status, setStatus] = useState('pending')
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
    if (!selectedStudent || !amount || !paidDate || !month) return alert('Please fill all fields')
    
    setLoading(true)
    const supabase = createClient()
    
    // ✅ Current User ගේ ID එක ගන්න
    const { data: { user } } = await supabase.auth.getUser()

    // Fee record එක insert කිරීම
    const { error } = await supabase
      .from('fees')
      .insert([{ 
        student_id: selectedStudent, 
        amount: parseFloat(amount),
        paid_date: paidDate,
        month: month,
        status,
        user_id: user?.id  // ✅ user_id එක add කරන්න
      }])

    if (error) {
      alert('Error adding fee: ' + error.message)
      setLoading(false)
    } else {
      alert('Fee record added successfully!')
      router.push('/dashboard/fees') // List page එකට යන්න
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Fee Record</h1>
        <p className="text-gray-500 mt-1">Create a new fee entry for a student.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Details</CardTitle>
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
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rs.)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="e.g., 2500" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input 
                id="month" 
                type="text" 
                placeholder="e.g., September 2026" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidDate">Paid Date</Label>
              <Input 
                id="paidDate" 
                type="date" 
                value={paidDate} 
                onChange={(e) => setPaidDate(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => value && setStatus(value)} defaultValue="pending">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Fee Record'}
              </Button>
              <Button type="button" variant="outline" asChild className="w-full">
                <Link href="/dashboard/fees">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}