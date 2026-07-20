'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/admin'
    }
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
    }}>
      <div style={{
        width: '100%', maxWidth: '380px', padding: '40px',
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: '16px',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            width: '42px', height: '36px', background: 'var(--accent)',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '11px', fontWeight: 700,
            color: '#fff', marginBottom: '16px',
          }}>CAV</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Admin login</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>CredgeAiVerse admin access only</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: 'var(--radius)',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-3)', color: 'var(--text)',
              fontSize: '14px', outline: 'none', width: '100%',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              padding: '10px 14px', borderRadius: 'var(--radius)',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-3)', color: 'var(--text)',
              fontSize: '14px', outline: 'none', width: '100%',
            }}
          />

          {error && <p style={{ fontSize: '13px', color: '#f87171' }}>{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: '11px', background: 'var(--accent)', color: '#fff',
              borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '14px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: '4px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    </main>
  )
}