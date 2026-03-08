'use client'

import { useEffect, useState } from 'react'
import { Section } from '@/lib/types'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { ArrowUpIcon, ArrowDownIcon, MoreVertical } from 'lucide-react'

// Sample chart data
const monthlyData = [
  { month: 'Jan', sales: 120 },
  { month: 'Feb', sales: 350 },
  { month: 'Mar', sales: 200 },
  { month: 'Apr', sales: 280 },
  { month: 'May', sales: 190 },
  { month: 'Jun', sales: 230 },
  { month: 'Jul', sales: 290 },
  { month: 'Aug', sales: 170 },
  { month: 'Sep', sales: 240 },
  { month: 'Oct', sales: 320 },
  { month: 'Nov', sales: 280 },
  { month: 'Dec', sales: 210 },
]

const statisticsData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 72 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 80 },
  { month: 'Jun', value: 88 },
  { month: 'Jul', value: 92 },
  { month: 'Aug', value: 85 },
  { month: 'Sep', value: 90 },
  { month: 'Oct', value: 95 },
  { month: 'Nov', value: 98 },
  { month: 'Dec', value: 110 },
]

export default function AdminDashboard() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections?includeDisabled=true')
      const data = await response.json()
      if (data.success && data.data) {
        setSections(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSections = sections.length
  const enabledSections = sections.filter((s) => s.enabled).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your CMS dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sections */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Sections</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalSections}</p>
              <p className="text-xs text-gray-500 mt-3">Last 30 days</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Enabled Sections */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Enabled</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{enabledSections}</p>
              <div className="flex items-center gap-1 mt-3">
                <ArrowUpIcon className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-semibold">12.5%</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Disabled Sections */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Disabled</p>
              <p className="text-3xl font-bold text-gray-400 mt-2">{totalSections - enabledSections}</p>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-xs text-gray-500 font-semibold">Inactive</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Updates This Week */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Updates</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {sections.filter((s) => {
                  const updated = new Date(s.updatedAt)
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  return updated > weekAgo
                }).length}
              </p>
              <div className="flex items-center gap-1 mt-3">
                <ArrowUpIcon className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-purple-600 font-semibold">This week</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Activity</h3>
              <p className="text-sm text-gray-600 mt-1">Section updates per month</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Status</h3>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${(enabledSections / totalSections || 0) * 339.3} 339.3`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{totalSections > 0 ? Math.round((enabledSections / totalSections) * 100) : 0}%</p>
                  <p className="text-xs text-gray-600 mt-1">Active</p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
              {enabledSections} of {totalSections} sections are published and live.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Content Statistics</h3>
            <p className="text-sm text-gray-600 mt-1">Trend you've set for each month</p>
          </div>
          <div className="flex gap-2">
            {['Monthly', 'Quarterly', 'Annually'].map((period) => (
              <button
                key={period}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={statisticsData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Sections Table */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sections</h3>
          <Link href="/admin/sections" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading sections...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No sections yet. Create one to get started!</p>
            <Link href="/admin/sections" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Create first section
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {sections.slice(0, 8).map((section) => (
                  <tr key={section.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{section.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{section.type}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          section.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                        {section.enabled ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(section.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/sections/${section.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
