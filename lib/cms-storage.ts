import { Section, CreateSectionInput, UpdateSectionInput } from './types'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'public', 'cms-data.json')

// Initialize default data if file doesn't exist
function initializeData(): Section[] {
  return [
    {
      id: '1',
      type: 'hero',
      title: 'Hero Section',
      order: 1,
      enabled: true,
      content: {
        headline: 'Your Trusted partner',
        subheadline: 'in apparel sourcing',
        backgroundImage: '/images/hero-bg.jpg',
        primaryButton: { text: 'Get Started', url: '#contact' },
        secondaryButton: { text: 'Learn More', url: '#about' },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'features',
      title: 'What Sets Us Apart',
      order: 2,
      enabled: true,
      content: {
        title: 'What sets us apart',
        subtitle: 'We stand out in every way',
        features: [
          {
            icon: '📦',
            title: 'Quality',
            description: 'Premium materials and expert craftsmanship',
          },
          {
            icon: '⚡',
            title: 'Efficient',
            description: 'Fast turnaround times without compromising',
          },
          {
            icon: '✓',
            title: 'On-time delivery',
            description: 'Reliable and consistent delivery',
          },
          {
            icon: '🌐',
            title: 'Global network',
            description: 'Worldwide expertise and support',
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'services',
      title: 'How We Work',
      order: 3,
      enabled: true,
      content: {
        title: 'How we work',
        services: [
          {
            icon: '💬',
            title: 'Consultation',
            description: 'We listen and understand your requirements',
          },
          {
            icon: '🎯',
            title: 'Supplier match',
            description: 'Finding the perfect partner for your needs',
          },
          {
            icon: '📋',
            title: 'Order management',
            description: 'Complete transparency in every step',
          },
          {
            icon: '✅',
            title: 'Quality check',
            description: 'Rigorous testing and inspection process',
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

// Read all sections
export async function getAllSections(): Promise<Section[]> {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const data = initializeData()
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
      return data
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(content) as Section[]
  } catch (error) {
    console.error('Error reading sections:', error)
    return initializeData()
  }
}

// Get a single section by ID
export async function getSectionById(id: string): Promise<Section | null> {
  const sections = await getAllSections()
  return sections.find((s) => s.id === id) || null
}

// Create a new section
export async function createSection(input: CreateSectionInput): Promise<Section> {
  const sections = await getAllSections()
  const maxOrder = Math.max(...sections.map((s) => s.order), 0)
  const newId = Date.now().toString()

  const newSection: Section = {
    id: newId,
    type: input.type,
    title: input.title,
    order: maxOrder + 1,
    enabled: true,
    content: input.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  sections.push(newSection)
  fs.writeFileSync(DATA_FILE, JSON.stringify(sections, null, 2))
  return newSection
}

// Update a section
export async function updateSection(id: string, input: UpdateSectionInput): Promise<Section | null> {
  const sections = await getAllSections()
  const index = sections.findIndex((s) => s.id === id)

  if (index === -1) return null

  const updated: Section = {
    ...sections[index],
    ...(input.title && { title: input.title }),
    ...(input.content && { content: input.content }),
    ...(input.enabled !== undefined && { enabled: input.enabled }),
    ...(input.order !== undefined && { order: input.order }),
    updatedAt: new Date().toISOString(),
  }

  sections[index] = updated
  fs.writeFileSync(DATA_FILE, JSON.stringify(sections, null, 2))
  return updated
}

// Delete a section
export async function deleteSection(id: string): Promise<boolean> {
  const sections = await getAllSections()
  const filtered = sections.filter((s) => s.id !== id)

  if (filtered.length === sections.length) return false

  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2))
  return true
}

// Reorder sections
export async function reorderSections(
  updates: Array<{ id: string; order: number }>,
): Promise<Section[]> {
  const sections = await getAllSections()

  updates.forEach((update) => {
    const section = sections.find((s) => s.id === update.id)
    if (section) {
      section.order = update.order
      section.updatedAt = new Date().toISOString()
    }
  })

  sections.sort((a, b) => a.order - b.order)
  fs.writeFileSync(DATA_FILE, JSON.stringify(sections, null, 2))
  return sections
}
