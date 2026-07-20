import { NextRequest, NextResponse } from 'next/server'
import { draftConcept } from '@/lib/nvidia'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { input, inputType } = await req.json()

    if (!input?.trim()) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const draft = await draftConcept(input, inputType || 'text')
    return NextResponse.json({ draft })
  } catch (err) {
    console.error('AI draft error:', err)
    return NextResponse.json(
      { error: 'AI drafting failed. Check your NVIDIA NIM API key.' },
      { status: 500 }
    )
  }
}
