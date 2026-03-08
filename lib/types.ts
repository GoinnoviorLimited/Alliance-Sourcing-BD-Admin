// Section types and interfaces for the CMS

export type SectionType = 'hero' | 'features' | 'services' | 'process' | 'products' | 'cta' | 'footer'

export interface Section {
  id: string
  type: SectionType
  title: string
  order: number
  enabled: boolean
  content: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Hero section
export interface HeroContent {
  headline: string
  subheadline: string
  backgroundImage?: string
  primaryButton?: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
}

// Features section
export interface Feature {
  icon: string
  title: string
  description: string
}

export interface FeaturesContent {
  title: string
  subtitle: string
  features: Feature[]
}

// Services section
export interface Service {
  icon: string
  title: string
  description: string
  details?: string[]
}

export interface ServicesContent {
  title: string
  services: Service[]
}

// Process section
export interface ProcessStep {
  icon: string
  title: string
  description: string
}

export interface ProcessContent {
  title: string
  steps: ProcessStep[]
}

// Products section
export interface ProductCategory {
  icon: string
  name: string
  description: string
}

export interface ProductsContent {
  title: string
  subtitle: string
  categories: ProductCategory[]
}

// CTA section
export interface CTAContent {
  headline: string
  subheadline: string
  primaryButton: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  backgroundImage?: string
}

// Footer section
export interface FooterContent {
  companyName: string
  description: string
  links: Array<{
    title: string
    url: string
  }>
  socialLinks?: Array<{
    platform: string
    url: string
  }>
  copyright: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateSectionInput {
  type: SectionType
  title: string
  content: Record<string, any>
}

export interface UpdateSectionInput {
  title?: string
  content?: Record<string, any>
  enabled?: boolean
  order?: number
}

export interface ReorderInput {
  sections: Array<{ id: string; order: number }>
}
