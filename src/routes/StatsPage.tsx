import { useState } from 'react'
import { TeamSelector } from '../components/TeamSelector'
import { Dashboard } from '../components/Dashboard'

export function StatsPage() {
  const [teamId, setTeamId] = useState('')
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <TeamSelector value={teamId} onChange={setTeamId} />
      </div>
      {!teamId ? (
        <p>Selecciona un equipo para ver sus estadísticas.</p>
      ) : (
        <Dashboard teamId={teamId} />
      )}
    </div>
  )
}
