import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminPipelinePage() {
  const steps = [
    { icon: '📡', title: 'RSS ingestion', desc: 'Scrapes Anthropic, OpenAI, DeepMind, Meta AI blogs', status: 'Weekly via GitHub Actions', detail: 'Runs every Monday 06:00 UTC' },
    { icon: '📄', title: 'Semantic Scholar', desc: 'Tracks paper mentions for all concepts', status: 'Free API, no key required', detail: 'Queries cs.AI + cs.CL on arXiv' },
    { icon: '⭐', title: 'GitHub activity', desc: 'Stars, issues, releases for tracked repos', status: 'Via GitHub API', detail: 'Rate limit: 60 req/hr unauthenticated' },
    { icon: '⚡', title: 'Status recalculation', desc: 'NVIDIA NIM re-scores all concept statuses', status: 'Uses Llama 3.3 70B', detail: 'Flags changes for admin review' },
    { icon: '📬', title: 'Digest generation', desc: 'Compiles weekly digest from new signals', status: 'Auto-generated', detail: 'Saved to digest_entries table' },
    { icon: '💾', title: 'Supabase keepalive', desc: 'Pings DB to prevent free-tier pause', status: 'Every 5 days via cron-job.org', detail: 'Free tier pauses after 7 days of inactivity' },
  ]

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '760px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Automation pipeline</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '28px' }}>GitHub Actions runs these steps weekly at no cost.</p>

          <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
            Pipeline active · Last run: Monday June 23, 06:00 UTC · Next: Monday June 30
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '4px' }}>{s.desc}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-4)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>{s.status}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{s.detail}</span>
                  </div>
                </div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0, marginTop: '4px' }}></span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontWeight: 600, marginBottom: '12px' }}>GitHub Actions workflow</div>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '12px' }}>
              The pipeline is defined in <code style={{ background: 'var(--bg-4)', padding: '1px 6px', borderRadius: '4px', fontSize: '12px' }}>.github/workflows/weekly-pipeline.yml</code>.
              It runs on a schedule and uses your secrets for Supabase and NVIDIA NIM.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>
              Free tier: <strong style={{ color: 'var(--text)' }}>2,000 minutes/month</strong> on GitHub Actions.
              The full pipeline takes ~5 minutes per run, so weekly runs cost ~20 min/month — well within the free tier.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
