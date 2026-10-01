// Lógica pura de generación de la cuadrícula mensual (sin React)

export interface CalendarDay {
  date: Date
  dayNumber: number
  isCurrentMonth: boolean
}

// Genera una rejilla de 42 días (6 semanas) que empieza en lunes,
// incluyendo relleno de los meses adyacentes.
// month: 0 = enero, 11 = diciembre
export function getMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1)

  // retroceder al lunes de esa semana (semana empieza en lunes)
  const dayOfWeek = firstOfMonth.getDay() // 0=domingo ... 6=sábado
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(firstOfMonth.getDate() - offset)

  const days: CalendarDay[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    days.push({
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    })
  }

  return days
}
