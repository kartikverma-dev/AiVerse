import OpenAI from 'openai'

const nim = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY || 'dummy_key',
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

export async function draftConcept(input: string, inputType: 'text' | 'url'): Promise<Record<string, unknown>> {
  const prompt = `You are an expert AI knowledge curator. Based on the following ${inputType === 'url' ? 'URL and its implied content' : 'text'}, extract and create a structured AI concept entry.

Input: ${input}

Respond with ONLY a valid JSON object (no markdown, no explanation) with these exact fields:
{
  "name": "Full concept name",
  "abbreviation": "SHORT or null",
  "tldr": "1-2 sentence jargon-free summary",
  "definition_technical": "Precise technical definition for practitioners",
  "definition_beginner": "Analogy-based explanation for beginners",
  "status": "emerging|growing|stable|declining|historical",
  "difficulty": "beginner|intermediate|advanced",
  "learning_priority": "learn_now|know_basics|nice_to_know|historical",
  "first_appeared": "Year or date context",
  "popularized_by": "Person, paper, or company",
  "categories": ["array", "of", "relevant", "categories"],
  "suggested_sources": [
    {"url": "url string", "title": "title", "source_type": "official_blog|paper|github|researcher|community", "authority_rank": 1}
  ],
  "examples": [
    {"title": "Example title", "description": "Brief description", "industry": "Industry"}
  ],
  "related_concepts": ["concept name 1", "concept name 2"]
}`

  const response = await nim.chat.completions.create({
    model: 'meta/llama-3.3-70b-instruct',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
    temperature: 0.3,
  })

  const content = response.choices[0]?.message?.content || '{}'
  const cleaned = content.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned)
}

export async function recalculateStatus(conceptName: string, evidence: {
  githubStars?: number
  paperMentions?: number
  communityVolume?: number
}): Promise<{ status: string; reasoning: string }> {
  const prompt = `Based on this evidence for the AI concept "${conceptName}", determine its current status.
Evidence: ${JSON.stringify(evidence)}
Respond with ONLY JSON: {"status": "emerging|growing|stable|declining|historical", "reasoning": "one sentence"}`

  const response = await nim.chat.completions.create({
    model: 'meta/llama-3.3-70b-instruct',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.1,
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim())
}

export async function generateDigestSummary(entries: Array<{ type: string; concept: string; detail: string }>): Promise<string> {
  const prompt = `Generate a concise weekly digest summary for the CredgeAiVerse platform based on these updates:
${JSON.stringify(entries, null, 2)}

Write 2-3 sentences summarizing the week's highlights for AI practitioners. Be specific and factual.`

  const response = await nim.chat.completions.create({
    model: 'meta/llama-3.3-70b-instruct',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.5,
  })

  return response.choices[0]?.message?.content || ''
}
