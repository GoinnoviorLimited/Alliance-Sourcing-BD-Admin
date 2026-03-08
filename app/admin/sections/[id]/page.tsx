'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Section } from '@/lib/types'
import { SectionForm } from '@/components/SectionForm'

export default function EditSectionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchSection = async () => {
      try {
        const response = await fetch(`/api/sections/${id}`)
        const data = await response.json()
        if (data.success && data.data) {
          setSection(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch section:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSection()
  }, [id])

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
        }),
      })

      if (response.ok) {
        router.push('/admin/sections')
      } else {
        alert('Failed to update section')
      }
    } catch (error) {
      console.error('Failed to update section:', error)
      alert('Failed to update section')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading section...</p>
      </div>
    )
  }

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Section not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Section</h1>
        <p className="text-gray-600">Update the {section.type} section content</p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <SectionForm
          section={section}
          sectionType={section.type}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
