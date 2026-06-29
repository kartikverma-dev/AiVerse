import { NextRequest, NextResponse } from 'next/server'
import { getConcepts } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pending = searchParams.get('pending') === 'true'

    const concepts = await getConcepts({
      approved: pending ? false : undefined,
      search: searchParams.get('q') || undefined,
      status: searchParams.get('status') || undefined,
    })

    return NextResponse.json({ concepts })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
