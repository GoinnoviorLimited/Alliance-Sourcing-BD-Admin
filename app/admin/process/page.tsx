'use client'

import { useRouter } from 'next/navigation'
import { SectionForm } from '@/components/SectionForm'

export default function CreateProcessPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'process',
          title: data.title,
          content: data.content,
        }),
      })

      if (response.ok) {
        router.push('/admin/sections')
      }
    } catch (error) {
      console.error('Failed to create section:', error)
      alert('Failed to create section')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Process Section</h1>
        <p className="text-gray-600">Create a new process section to showcase your workflow</p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <SectionForm sectionType="process" onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
