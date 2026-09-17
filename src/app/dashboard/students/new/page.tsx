// src/app/dashboard/students/new/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function NewStudentPage() {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    // Database එකට data insert කිරීම
    const { error } = await supabase
      .from('students')
      .insert([{ name, grade, parent_phone: parentPhone }])

    if (error) {
      alert('Error adding student: ' + error.message)
      setLoading(false)
    } else {
      alert('Student added successfully!')
      router.push('/dashboard/students') // List page එකට යන්න
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
        <p className="text-gray-500 mt-1">Enter student details below.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Kamal Perera" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Grade / Class</Label>
              <Input 
                id="grade" 
                placeholder="e.g., Grade 10 - Science" 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Parent Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="e.g., 0771234567" 
                value={parentPhone} 
                onChange={(e) => setParentPhone(e.target.value)} 
                required 
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Student'}
              </Button>
              <Button type="button" variant="outline" asChild className="w-full">
                <Link href="/dashboard/students">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}