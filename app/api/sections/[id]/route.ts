import { NextRequest, NextResponse } from 'next/server'
import { getSectionById, updateSection, deleteSection } from '@/lib/cms-storage'
import { UpdateSectionInput, ApiResponse } from '@/lib/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params
    const section = await getSectionById(id)

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<typeof section>>({
      success: true,
      data: section,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch section' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = (await request.json()) as UpdateSectionInput

    const updated = await updateSection(id, body)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<typeof updated>>({
      success: true,
      data: updated,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update section' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params
    const deleted = await deleteSection(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete section' },
      { status: 500 },
    )
  }
}
