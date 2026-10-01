import { useMyTeams } from '@/hooks/useMyTeams'

export function TeamSelector({
  value, onChange,
}: { value: string; onChange: (teamId: string) => void }) {
  const { data: teams, isLoading } = useMyTeams()
  if (isLoading) return <p>Cargando equipos...</p>
  if (!teams || teams.length === 0) return <p>No perteneces a ningún equipo aún.</p>
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Elige un equipo</option>
      {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
  )
}
