import { NextRequest, NextResponse } from 'next/server'
import { getAllSections, createSection } from '@/lib/cms-storage'
import { CreateSectionInput, ApiResponse } from '@/lib/types'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeDisabled = searchParams.get('includeDisabled') === 'true'

    const sections = await getAllSections()
    const filtered = includeDisabled
      ? sections.sort((a, b) => a.order - b.order)
      : sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order)

    return NextResponse.json<ApiResponse<typeof filtered>>({
      success: true,
      data: filtered,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateSectionInput

    if (!body.type || !body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const newSection = await createSection(body)

    return NextResponse.json<ApiResponse<typeof newSection>>(
      {
        success: true,
        data: newSection,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create section' },
      { status: 500 },
    )
  }
}
