// src/app/dashboard/students/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DeleteStudentButton from '@/components/DeleteStudentButton' // ✅ Import කරන්න
import { toast } from 'sonner'

export default async function StudentsPage() {
  const supabase = await createClient()
  
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching students:', error)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage your tuition students here.</p>
        </div>
        <Button asChild><Link href="/dashboard/students/new">+ Add Student</Link></Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Students ({students?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Grade</th>
                    <th className="px-6 py-3">Parent Phone</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{student.name}</td>
                      <td className="px-6 py-4">{student.grade}</td>
                      <td className="px-6 py-4">{student.parent_phone}</td>
                      <td className="px-6 py-4 flex gap-2">
                        {/* Edit Button (Placeholder for now) */}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/students/${student.id}/edit`}>Edit</Link>
                        </Button>
                        {/* ✅ Delete Button */}
                        <DeleteStudentButton studentId={student.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">No students found. Add your first student!</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}