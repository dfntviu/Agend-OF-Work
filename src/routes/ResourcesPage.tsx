import { useState } from 'react'
import { TeamSelector } from '../components/TeamSelector'
import { useCreateResource } from '../hooks/useCreateResource'
import { useDeleteResource } from '../hooks/useDeleteResource'
import { EditResourceForm } from '../components/EditResourceForm'
import { useResources } from '../hooks/useResources'

export function ResourcesPage() {
  const [teamId, setTeamId] = useState('')
  const [editingResource, setEditingResource] = useState<any | null>(null)
  const { data: resources = [] } = useResources(teamId)
  const createResource = useCreateResource(teamId)
  const deleteResource = useDeleteResource(teamId)
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('room')

  function handleCreate() {
    createResource.mutate({ name: nombre, type: tipo }, { onSuccess: () => { setNombre(''); setTipo('room') } })
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <TeamSelector value={teamId} onChange={setTeamId} />
      </div>
      {!teamId ? (
        <p>Selecciona un equipo para gestionar sus recursos.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del recurso" />
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="room">Sala</option>
              <option value="equipment">Equipo</option>
              <option value="vehicle">Vehículo</option>
              <option value="other">Otro</option>
            </select>
            <button onClick={handleCreate} disabled={createResource.isPending || !nombre}>
              {createResource.isPending ? 'Creando...' : 'Crear'}
            </button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {resources.map((r: any) => (
              <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                <span style={{ flex: 1 }}>{r.name} ({r.type})</span>
                <button onClick={() => setEditingResource(r)}>Editar</button>
                <button onClick={() => deleteResource.mutate(r.id)}>Borrar</button>
              </li>
            ))}
          </ul>
          {editingResource && (
            <EditResourceForm teamId={teamId} resource={editingResource} onDone={() => setEditingResource(null)} />
          )}
        </div>
      )}
    </div>
  )
}
