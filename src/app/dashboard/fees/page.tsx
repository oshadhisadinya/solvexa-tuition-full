
// src/app/dashboard/fees/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export default async function FeesPage() {
  const supabase = await createClient()
  
  // Database එකෙන් fees records ගන්න (paid_date column එක use කරන්න)
  const { data: fees, error } = await supabase
    .from('fees')
    .select('*, students(name, grade)')
    .order('paid_date', { ascending: true })

  if (error) {
    console.error('Supabase Error Details:', JSON.stringify(error))
    return (
      <div className="p-8 text-center border rounded-lg bg-red-50">
        <h2 className="text-xl font-bold text-red-600">⚠️ Error Loading Fees</h2>
        <p className="mt-2 text-gray-700 font-mono text-sm">{error.message}</p>
        <p className="mt-4 text-sm text-gray-500">Check browser console for full details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Fees Management</h1>
          <p className="text-gray-500 mt-1">Track and manage student payments.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/fees/new">+ Add Fee Record</Link>
        </Button>
      </div>

      {/* Fees List Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Fee Records ({fees?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {fees && fees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Paid Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee: any) => (
                    <tr key={fee.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{fee.students?.name || 'N/A'}</td>
                      <td className="px-6 py-4">Rs. {fee.amount}</td>
                      <td className="px-6 py-4">{new Date(fee.paid_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          fee.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : fee.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/fees/${fee.id}`}>Edit</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No fee records found. Add your first record!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}