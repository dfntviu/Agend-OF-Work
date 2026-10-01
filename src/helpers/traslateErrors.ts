export function errorsTranslate(error: any): string {
    const msg = error?.message || '';

    if (msg.includes('events_check')) {
        return 'La hora de Fin debe ser posterior a la de Inicio';
    }

    if (msg.includes('null value') && msg.includes('not-null')) {
        return 'Faltan campos por completar';
    }
    if (msg.includes('row level security') && msg.includes('violates')) {
        return 'NO tienes PERMISOS para revisar la acción';
    }

    // Cualquier otro
    return 'Ocurrió un error al guardar. Intenté Guardar nuevamente..';
}