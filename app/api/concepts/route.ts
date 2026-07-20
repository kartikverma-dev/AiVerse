import { NextRequest, NextResponse } from 'next/server'
import { getConcepts, createConceptFromDraft, approveConcept, deleteConcept, updateConcept } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const concepts = await getConcepts({
      status: searchParams.get('status') || undefined,
      search: searchParams.get('q') || undefined,
      approved: searchParams.get('pending') === 'true' ? false : true,
    })

    // Filter by category client-side (categories is an array field)
    const category = searchParams.get('category')
    const filtered = category
      ? concepts.filter(c => c.categories?.includes(category))
      : concepts

    return NextResponse.json({ concepts: filtered })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch concepts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action, id, draft, updates } = body

    if (action === 'create') {
      const conceptId = await createConceptFromDraft(draft)
      return NextResponse.json({ id: conceptId })
    }

    if (action === 'approve') {
      await approveConcept(id)
      revalidatePath('/')
      revalidatePath('/concepts')
      revalidatePath('/graph')
      revalidatePath('/timeline')
      revalidatePath('/concepts/[slug]', 'page')
      return NextResponse.json({ ok: true })
    }

    if (action === 'delete') {
      await deleteConcept(id)
      revalidatePath('/')
      revalidatePath('/concepts')
      revalidatePath('/graph')
      revalidatePath('/timeline')
      revalidatePath('/concepts/[slug]', 'page')
      return NextResponse.json({ ok: true })
    }

    if (action === 'update') {
      await updateConcept(id, updates)
      revalidatePath('/')
      revalidatePath('/concepts')
      revalidatePath('/graph')
      revalidatePath('/timeline')
      revalidatePath('/concepts/[slug]', 'page')
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 })
  }
}
