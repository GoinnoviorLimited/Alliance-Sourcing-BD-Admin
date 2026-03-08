'use client'

import { useEffect, useState } from 'react'
import { Section } from '@/lib/types'
import Link from 'next/link'
import { useState as useStateCallback } from 'react'

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections?includeDisabled=true')
      const data = await response.json()
      if (data.success && data.data) {
        // Sort by order
        const sorted = [...data.data].sort((a, b) => a.order - b.order)
        setSections(sorted)
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setSections((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete section:', error)
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled }),
      })

      if (response.ok) {
        const updated = await response.json()
        setSections((prev) =>
          prev.map((s) => (s.id === id ? updated.data : s)),
        )
      }
    } catch (error) {
      console.error('Failed to update section:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Sections</h1>
          <p className="text-gray-600">Manage and edit all your website sections</p>
        </div>
        <Link
          href="/admin"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Create New
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">No sections yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Updated</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-600 font-medium">{section.order}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 font-medium">{section.title}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 capitalize">{section.type}</td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => handleToggleEnabled(section.id, section.enabled)}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        section.enabled
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {section.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(section.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/sections/${section.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(section.id)}
                        disabled={deleting === section.id}
                        className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        {deleting === section.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
