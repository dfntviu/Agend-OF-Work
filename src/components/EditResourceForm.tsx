import { useState } from 'react'
import { useUpdateResource } from '../hooks/useUpdateResource';

interface ResourceItem { id: string; name: string; type: string }

export function EditResourceForm({
  teamId, resource, onDone,
}: { teamId: string; resource: ResourceItem; onDone: () => void }) {
  const updateResource = useUpdateResource(teamId)
  const [nombre, setNombre] = useState(resource.name)
  const [tipo, setTipo] = useState(resource.type)

  function handleSave() {
    updateResource.mutate({ resourceId: resource.id, nombre, tipo }, { onSuccess: onDone })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px', border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
      <strong>Editar recurso</strong>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <select value={tipo} onChange={e => setTipo(e.target.value)}>
        <option value="room">Sala</option>
        <option value="equipment">Equipo</option>
        <option value="vehicle">Vehículo</option>
        <option value="other">Otro</option>
      </select>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleSave} disabled={updateResource.isPending || !nombre}>
          {updateResource.isPending ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={onDone}>Cancelar</button>
      </div>
      {updateResource.isError && <p style={{ color: 'red' }}>Error: {String(updateResource.error)}</p>}
    </div>
  )
}
