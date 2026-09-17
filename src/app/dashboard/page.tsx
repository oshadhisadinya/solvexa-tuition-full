// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // 1. Basic Counts ගන්න
  const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true })
  const { count: attendanceCount } = await supabase.from('attendance').select('*', { count: 'exact', head: true })
  const { count: feePending } = await supabase.from('fees').select('*', { count: 'exact', head: true }).eq('status', 'pending')

  // 2. ✅ This Month's Income Calculate කරන්න
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { data: monthlyFees } = await supabase
    .from('fees')
    .select('amount')
    .eq('status', 'paid')
    .gte('paid_date', firstDayOfMonth)
  
  const totalIncome = monthlyFees?.reduce((sum, fee) => sum + Number(fee.amount), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your tuition classes.</p>
      </div>

      {/* ✅ Stats Cards Grid - දැන් Cards 4ක් තියෙනවා (lg:grid-cols-4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Students */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{studentCount || 0}</div>
            <p className="text-xs text-green-600 mt-1">Active learners</p>
          </CardContent>
        </Card>

        {/* Card 2: Attendance Records */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceCount || 0}</div>
            <p className="text-xs text-blue-600 mt-1">Total marked sessions</p>
          </CardContent>
        </Card>

        {/* Card 3: Pending Fees */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{feePending || 0}</div>
            <p className="text-xs text-orange-600 mt-1">Invoices awaiting payment</p>
          </CardContent>
        </Card>

        {/* ✅ Card 4: This Month's Income (අලුත් Card එක) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">This Month's Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rs. {totalIncome.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1">Collected fees</p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link href="/dashboard/students/new">
          <Card className="border-dashed border-2 border-gray-300 bg-transparent hover:bg-gray-50 cursor-pointer transition-colors h-full">
            <CardContent className="flex flex-col items-center justify-center h-32">
              <span className="text-4xl mb-2">➕</span>
              <h3 className="font-semibold text-gray-700">Add New Student</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/attendance/mark">
          <Card className="border-dashed border-2 border-gray-300 bg-transparent hover:bg-gray-50 cursor-pointer transition-colors h-full">
            <CardContent className="flex flex-col items-center justify-center h-32">
              <span className="text-4xl mb-2">📝</span>
              <h3 className="font-semibold text-gray-700">Mark Attendance</h3>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}