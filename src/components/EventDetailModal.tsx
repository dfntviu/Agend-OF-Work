interface EventDetailModalProps {
    event: any  // el evento para mostrar
    onClose: () => void // f(n) para cerrar el modal
    nombrePorId: any // diccionario {id:nombre} para el creador
    recursoPorId: any // diccionario {id:recurso} para el recurso
}

  export function EventDetailModal({event,onClose,nombrePorId,recursoPorId}: EventDetailModalProps) {

    if (!event) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position:"fixed", top:0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: "center", justifyContent: "center",
                zIndex: 1000
            }}
         >
             {/* La VENTANA: El recuadro blanco de los datos */}
            <div
                onClick={e => e.stopPropagation()} // Dentro no se cierra (importante), Ctrl fuera del modal
                style={{
                  background: '#fff', borderRadius: '12px', padding: '24px',
                  maxWidth: '400px', width: '90%',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
            >
                  <h2 style={{marginTop:0}}>{event.title}</h2>
                <p><strong>Recurso:</strong>{ recursoPorId[event.resource_id] || 'Sin Recurso'} </p>
                <p><strong>Creado Por:</strong>{nombrePorId[event.created_by]|| 'Desconocido' } </p>
                <p><strong>Inicio:</strong>{new Date(event.starts_at).toLocaleString() }</p>
                <p><strong>Fin:   </strong>{new Date(event.ends_at).toLocaleString() }</p>
                <p><strong>Asignado a:</strong>{nombrePorId[event.assigned_to] || 'Sin asignar'} </p>      {/* ending change of Structure*/}

                <button onClick={onClose} style={{marginTop: '16px'}}>Cerrar</button>
            </div>
        </div>
    )
  }