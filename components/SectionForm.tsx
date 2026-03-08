'use client'

import { useState } from 'react'
import { Section, SectionType } from '@/lib/types'

interface SectionFormProps {
  section?: Section
  sectionType: SectionType
  onSubmit: (data: any) => Promise<void>
  loading?: boolean
}

export function SectionForm({
  section,
  sectionType,
  onSubmit,
  loading = false,
}: SectionFormProps) {
  const [formData, setFormData] = useState(section?.content || {})
  const [title, setTitle] = useState(section?.title || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ title, content: formData })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleArrayItemChange = (arrayKey: string, index: number, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayKey]: (prev[arrayKey] || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }))
  }

  const addArrayItem = (arrayKey: string, defaultItem: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayKey]: [...(prev[arrayKey] || []), defaultItem],
    }))
  }

  const removeArrayItem = (arrayKey: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [arrayKey]: (prev[arrayKey] || []).filter((_, i) => i !== index),
    }))
  }

  const renderFormFields = () => {
    switch (sectionType) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
              <input
                type="text"
                value={formData.headline || ''}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subheadline</label>
              <textarea
                value={formData.subheadline || ''}
                onChange={(e) => handleInputChange('subheadline', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image URL
              </label>
              <input
                type="text"
                value={formData.backgroundImage || ''}
                onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                value={formData.primaryButton?.text || ''}
                onChange={(e) =>
                  handleInputChange('primaryButton', {
                    ...formData.primaryButton,
                    text: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Button URL
              </label>
              <input
                type="text"
                value={formData.primaryButton?.url || ''}
                onChange={(e) =>
                  handleInputChange('primaryButton', {
                    ...formData.primaryButton,
                    url: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem('features', {
                      icon: '📦',
                      title: 'New Feature',
                      description: '',
                    })
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Feature
                </button>
              </div>

              {(formData.features || []).map((feature, idx) => (
                <div
                  key={idx}
                  className="mb-4 p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <input
                    type="text"
                    value={feature.icon || ''}
                    onChange={(e) => handleArrayItemChange('features', idx, 'icon', e.target.value)}
                    placeholder="Icon/Emoji"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={feature.title || ''}
                    onChange={(e) => handleArrayItemChange('features', idx, 'title', e.target.value)}
                    placeholder="Feature Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    value={feature.description || ''}
                    onChange={(e) =>
                      handleArrayItemChange('features', idx, 'description', e.target.value)
                    }
                    placeholder="Feature Description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', idx)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div>
            <p className="text-gray-600">Form for {sectionType} section</p>
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {renderFormFields()}

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={submitting || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting || loading ? 'Saving...' : 'Save Section'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
