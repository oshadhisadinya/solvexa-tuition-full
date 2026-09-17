// src/components/DeleteStudentButton.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function DeleteStudentButton({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId)
    
    if (error) {
      toast.error('Failed to delete student', { description: error.message })
    } else {
      toast.success('Student deleted successfully')
      router.refresh() // Page එක reload වේවි (data update වෙයි)
    }
    setLoading(false)
  }

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete} 
      disabled={loading}
    >
      <Trash2 size={16} className={loading ? 'animate-spin' : ''} />
    </Button>
  )
}