'use client'

import { useState, useMemo } from 'react'
import type { Concept } from '@/types'

interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

// Simple hash helper for deterministic shuffle
function getShuffledOptions(rawOptions: string[], seedStr: string) {
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i)
    hash |= 0
  }
  const targetIndex = Math.abs(hash) % rawOptions.length
  const shuffled = [...rawOptions]
  
  // Swap initial correct option (index 0) with targetIndex
  const temp = shuffled[targetIndex]
  shuffled[targetIndex] = shuffled[0]
  shuffled[0] = temp

  return {
    options: shuffled,
    correctIndex: targetIndex
  }
}

export default function ConceptQuiz({ concept }: { concept: Concept }) {
  const questions: Question[] = useMemo(() => {
    // Question 1
    const rawOpts1 = [
      concept.tldr,
      `Replacing all transformer attention layers with standard recurrent neural networks.`,
      `Directly fine-tuning model parameters using uncurated internet datasets without safety evaluation.`,
      `Converting structured vector embeddings back into plain unstructured text files.`
    ]
    const q1Shuffle = getShuffledOptions(rawOpts1, concept.slug + '-q1')

    // Question 2
    const rawOpts2 = [
      `Maturity: ${concept.status.toUpperCase()} · Difficulty: ${concept.difficulty.toUpperCase()}`,
      `Maturity: DECLINING · Difficulty: BEGINNER`,
      `Maturity: HISTORICAL · Difficulty: ADVANCED`,
      `Maturity: UNKNOWN · Difficulty: NONE`
    ]
    const q2Shuffle = getShuffledOptions(rawOpts2, concept.slug + '-q2-seed')

    return [
      {
        id: 1,
        question: `What is the primary architectural purpose of ${concept.name}${concept.abbreviation ? ` (${concept.abbreviation})` : ''}?`,
        options: q1Shuffle.options,
        correctIndex: q1Shuffle.correctIndex,
        explanation: `Correct! ${concept.name} is designed to: "${concept.tldr}"`
      },
      {
        id: 2,
        question: `Which maturity level and difficulty rating best classify ${concept.name}?`,
        options: q2Shuffle.options,
        correctIndex: q2Shuffle.correctIndex,
        explanation: `${concept.name} is currently classified as "${concept.status}" with a "${concept.difficulty}" technical entry barrier.`
      }
    ]
  }, [concept])

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (qId: number, oIdx: number) => {
    if (submitted) return
    setSelectedAnswers(prev => ({ ...prev, [qId]: oIdx }))
  }

  const isAllAnswered = Object.keys(selectedAnswers).length === questions.length

  const score = questions.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc
  }, 0)

  const resetQuiz = () => {
    setSelectedAnswers({})
    setSubmitted(false)
  }

  return (
    <section style={{
      marginBottom: '44px',
      background: 'var(--bg-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius)',
      padding: '28px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            🧠 Knowledge Verification
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
            Concept Mastery Check
          </h2>
        </div>

        {submitted && (
          <div style={{
            background: score === questions.length ? 'rgba(63, 166, 107, 0.12)' : 'rgba(212, 175, 55, 0.12)',
            border: `1px solid ${score === questions.length ? 'var(--success)' : 'var(--accent)'}`,
            color: score === questions.length ? 'var(--success)' : 'var(--accent)',
            borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 700,
            fontFamily: 'var(--font-mono)'
          }}>
            🎯 Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id]
          const isCorrect = selectedOption === q.correctIndex

          return (
            <div key={q.id} style={{
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px'
            }}>
              <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text)', lineHeight: '1.5' }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginRight: '6px' }}>Q{qIndex + 1}.</span>
                {q.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, oIdx) => {
                  let btnBg = 'var(--bg-2)'
                  let btnBorder = 'var(--border)'
                  let btnColor = 'var(--text-2)'

                  if (selectedOption === oIdx) {
                    btnBg = 'var(--accent-dim)'
                    btnBorder = 'var(--accent)'
                    btnColor = 'var(--text)'
                  }

                  if (submitted) {
                    if (oIdx === q.correctIndex) {
                      btnBg = 'rgba(63, 166, 107, 0.15)'
                      btnBorder = 'var(--success)'
                      btnColor = '#fff'
                    } else if (selectedOption === oIdx && !isCorrect) {
                      btnBg = 'rgba(239, 68, 68, 0.15)'
                      btnBorder = 'var(--danger)'
                      btnColor = '#fff'
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, oIdx)}
                      style={{
                        padding: '12px 16px', borderRadius: '8px', border: `1px solid ${btnBorder}`,
                        background: btnBg, color: btnColor, textAlign: 'left', fontSize: '13.5px',
                        cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: '1.5'
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                        color: 'var(--text-3)', background: 'var(--bg-1)', padding: '2px 6px',
                        borderRadius: '4px', border: '1px solid var(--border)', flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>

              {submitted && (
                <div style={{
                  padding: '12px 14px', borderRadius: '8px',
                  background: isCorrect ? 'rgba(63, 166, 107, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1px solid ${isCorrect ? 'rgba(63, 166, 107, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                  fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.6'
                }}>
                  <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                    {isCorrect ? '✅ Explanation:' : '❌ Explanation:'}
                  </strong>{' '}
                  {q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {!submitted ? (
          <button
            disabled={!isAllAnswered}
            onClick={() => setSubmitted(true)}
            style={{
              background: isAllAnswered ? 'var(--accent)' : 'var(--bg-3)',
              color: isAllAnswered ? '#000' : 'var(--text-3)',
              border: 'none', padding: '10px 22px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 700, cursor: isAllAnswered ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em',
              boxShadow: isAllAnswered ? '0 4px 14px rgba(212, 175, 55, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Check Answers →
          </button>
        ) : (
          <button
            onClick={resetQuiz}
            style={{
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '10px 20px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', textTransform: 'uppercase'
            }}
          >
            🔄 Retake Quiz
          </button>
        )}
      </div>
    </section>
  )
}
