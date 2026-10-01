  /** MODIFIACION EN CURSO -- Modificacion en la creacion y edicion de Eventos de la opcion del calendario. DEbera mostrarse en el modal 
   */
import { useState } from 'react'
import { useUpdateEvent } from '../hooks/useUpdateEvent'
// nuevas librerias modulares
  import { useMembers } from '../hooks/useMembers'
  import { useProfiles } from '../hooks/useProfiles'

  //se agrego la asignacion
interface EventItem { id: string; title: string; starts_at: string; ends_at: string; assigned_to: string | null }

export function EditEventForm({
  teamId, event, onDone,
}: { teamId: string; event: EventItem; onDone: () => void }) {
  const updateEvent = useUpdateEvent(teamId)
  // se aniadieron los miembros y los perfiles p/despliegue practico
   const {data: members = []} = useMembers(teamId);
   const {data: profiles = []} = useProfiles();

  const [title, setTitle] = useState(event.title)
  const [startsAt, setStartsAt] = useState(toLocalInput(event.starts_at))
  const [endsAt, setEndsAt] = useState(toLocalInput(event.ends_at));
  // Utilizarlos en los Hooks Base de React
  const [assignedTo, setAssignedTo ] = useState(event.assigned_to || ''); //precargar el tipo perfil asignado actualmente
  
  // diccionario de nombres
   const nombrePorId  = profiles.reduce((acc: any, p: any) => {
        acc[p.id] = p.displayname
        return acc
     },{});

  function handleSave() {  // #* asignacion para Miembro o perfil *#
    updateEvent.mutate({ eventId: event.id, changes: { title, startsAt, endsAt, assignedTo} }, { onSuccess: onDone })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px', border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
      <strong>Editar evento</strong>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <label>Inicio:</label>
      <input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} />
      <label>Fin:</label>
      <input type="datetime-local" value={endsAt} onChange={e => setEndsAt(e.target.value)} />
      {/* DOM Page Responsive for the see of the option Event on JSX */}
      
      <label>Asignar a:</label>
       <select value={assignedTo} onChange={ e => setAssignedTo(e.target.value) }>
          <option value=""> Sin Asignar</option>
          {members.map((m:any) => (
            <option key={m.id} value={m.user_id}>
               {nombrePorId[m.user_id]||'Desconocido' }
            </option>
           ))}  
      </select>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleSave} disabled={updateEvent.isPending || !title || !startsAt || !endsAt}>
          {updateEvent.isPending ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={onDone}>Cancelar</button>
      </div>
      {updateEvent.isError && <p style={{ color: 'red' }}>Error: {String(updateEvent.error)}</p>}
    </div>
  )
}

function toLocalInput(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
