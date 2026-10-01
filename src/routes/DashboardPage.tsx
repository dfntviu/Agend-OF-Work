import { useState } from 'react'
import { useMyTeams } from '../hooks/useMyTeams'
import { useCreateTeam } from '../hooks/useCreateTeam'
import { authService } from '../services/auth.service'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { data: teams, isLoading } = useMyTeams()
  const createTeam = useCreateTeam()
  const [name, setName] = useState('')

  function handleCreate() {
    const code = 'EQ' + Date.now().toString().slice(-5)
    createTeam.mutate({ name, code }, { onSuccess: () => setName('') })
  }

  if (isLoading) return <p>Cargando equipos...</p>

  return (
    <div>
      <h1>Mis equipos</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del equipo" />
      <button onClick={handleCreate} disabled={createTeam.isPending || !name}>
        {createTeam.isPending ? 'Creando...' : 'Crear equipo'}
      </button>
      <button onClick={() => authService.signOut()}>Salir</button>

      <ul>
        {teams?.map((t: any) => <li key={t.id}>{t.name} — código: {t.code}</li>)}
      </ul>|
      {/* Temporal (solo para testing) */}
      <Link to="/calendar">Ver Calendario</Link>
    </div>
    
  )
}
