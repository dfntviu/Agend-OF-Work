import { useState } from 'react'
import { TeamSelector } from '../components/TeamSelector'
import { useMyTeams } from '../hooks/useMyTeams'
import { useMembers } from '../hooks/useMembers'
import { useProfiles } from '../hooks/useProfiles'
import { useJoinTeam } from '../hooks/useJoinTeam';
import { useRemoveMember } from "../hooks/useRemoveMember";
import { useUpdateRole   } from "../hooks/useUpdateRole";
  import { useAuth } from '../context/AuthContext';


export function TeamPage() {
    // Definicion vars de sesion, control de autoaceptacion de permisos
  const { session } = useAuth()
  const miUserId = session?.user?.id

  const [teamId, setTeamId] = useState('')
  const [codigoInput, setCodigoInput] = useState('')

  const { data: teams = [] } = useMyTeams()
  const { data: members = [] } = useMembers(teamId)
  const { data: profiles = [] } = useProfiles()
  // # Varibles nuevas# opciones deshabilitadas: Eliminar miembros o actualizar su rol
  
  const updateRole = useUpdateRole(teamId);
  const removeMember = useRemoveMember(teamId);
  
   // ** Hallar mi membresia en este equipo, para identificar mi rol **
  const myMember = members.find((m:any) => m.user_id === miUserId)
  const ImAdmin = myMember?.role === 'owner' || myMember?.role === 'admin'

  const joinTeam = useJoinTeam()

  // el equipo seleccionado (para mostrar su código)
  const equipoActual = teams.find((t: any) => t.id === teamId)

  // diccionario uuid -> nombre (mismo patrón del dashboard)
  const nombrePorId = profiles.reduce((acc: any, p: any) => {
    acc[p.id] = p.displayname
    return acc
  }, {})

  function handleJoin() {
    joinTeam.mutate(codigoInput, { onSuccess: () => setCodigoInput('') })
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1>Mi Equipo</h1>

      {/* unirse a un equipo con código */}
      <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <strong>Unirse a un equipo</strong>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input
            value={codigoInput}
            onChange={e => setCodigoInput(e.target.value)}
            placeholder="Código de invitación"
          />
          <button onClick={handleJoin} disabled={joinTeam.isPending || !codigoInput}>
            {joinTeam.isPending ? 'Uniéndose...' : 'Unirse'}
          </button>
        </div>
        {joinTeam.isError && <p style={{ color: 'red' }}>{String(joinTeam.error)}</p>}
      </div>

      {/* seleccionar equipo para ver detalles */}
      <div style={{ marginBottom: '16px' }}>
        <TeamSelector value={teamId} onChange={setTeamId} />
      </div>

      {equipoActual && (
        <div>
          {/* código del equipo (para invitar) */}
          <p> 
            Código para invitar: <strong>{equipoActual.code}</strong>
          </p>

          {/* lista de miembros */}
          <h3>Miembros</h3>
          <ul>
            {members.map((m: any) => (
          <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
            <span style={{ flex: 1 }}>
              {nombrePorId[m.user_id] || 'Desconocido'} — {m.role}
            </span>
              {/* Codigo unicamente funcional si se tienes al menos 3 usuarios en la tabla de profiles o en la Interfaz */}
           {/* Los botones NO aparecen para el owner (protección) */}
              {/* evitar que el usuario activo, modifique sus propios permisos */}
            { ImAdmin && m.role !== 'owner' && m.userId !== miUserId && (
              <>
                {m.role === 'member' ? (
                  <button onClick={() => updateRole.mutate({ membershipId: m.id, newRole: 'admin' })}>
                    Hacer admin
                  </button>
                ) : (
                  <button onClick={() => updateRole.mutate({ membershipId: m.id, newRole: 'member' })}>
                    Hacer member
                  </button>
                )}
                <button onClick={() => removeMember.mutate(m.id)}>Expulsar</button>
              </>
            )}
            {/* m.role !== 'owner' && m.user_id !== miUserId && */}
          </li>
            ))}
          </ul>
        </div>
      )}
      {/*{ members.map((m: any) => (
           LOGICA SENCILLA SIN PERMISOS SPECIALS: QUITAR Y/O ACTUALIZAR
           <li key={m.id}>
            {nombrePorId[m.user_id] || 'Desconocido'} — {m.role}
           </li>
        ))} */}
    </div>
  )
}