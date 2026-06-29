import { NextResponse } from 'next/server'
import { getDigestEntries } from '@/lib/db'

export async function GET() {
  try {
    const entries = await getDigestEntries()
    return NextResponse.json({ entries })
  } catch (err) {
    return NextResponse.json({ error: 'Failed', entries: [] }, { status: 500 })
  }
}
