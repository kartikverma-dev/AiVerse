/**
 * Extracts a 4-digit numeric year from a text string (e.g., "mid-2025" -> 2025).
 * If no year is found, returns the default maximum year (2026) so the concept is shown.
 */
export function parseYear(val?: string | null): number {
  if (!val) return 2026
  const match = val.match(/\d{4}/)
  return match ? parseInt(match[0], 10) : 2026
}
