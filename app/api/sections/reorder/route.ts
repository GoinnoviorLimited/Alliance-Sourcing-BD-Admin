import { NextRequest, NextResponse } from 'next/server'
import { reorderSections } from '@/lib/cms-storage'
import { ReorderInput, ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ReorderInput

    if (!body.sections || !Array.isArray(body.sections)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reorder data' },
        { status: 400 },
      )
    }

    const updated = await reorderSections(body.sections)

    return NextResponse.json<ApiResponse<typeof updated>>({
      success: true,
      data: updated,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to reorder sections' },
      { status: 500 },
    )
  }
}
