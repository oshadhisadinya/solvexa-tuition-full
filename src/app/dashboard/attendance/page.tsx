// src/app/dashboard/attendance/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AttendancePage() {
  const supabase = await createClient()
  
  // Database එකෙන් attendance records ගන්න
  const { data: records, error } = await supabase
    .from('attendance')
    .select('*, students(name, grade)')
    .order('date', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching attendance:', error)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">Track student attendance for your classes.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/attendance/mark">+ Mark Attendance</Link>
        </Button>
      </div>

      {/* Recent Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records && records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Grade</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record: any) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium">{record.students?.name || 'N/A'}</td>
                      <td className="px-6 py-4">{record.students?.grade || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No attendance records found. Start marking attendance!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}