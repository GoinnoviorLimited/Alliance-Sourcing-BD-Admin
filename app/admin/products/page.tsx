'use client'

import { useRouter } from 'next/navigation'
import { SectionForm } from '@/components/SectionForm'

export default function CreateProductsPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'products',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Products Section</h1>
        <p className="text-gray-600">Create a new products section to showcase your offerings</p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <SectionForm sectionType="products" onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
