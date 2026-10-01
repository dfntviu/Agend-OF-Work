import { useState } from 'react'
import { MonthCalendar } from './MonthCalendar'

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]

export function CalendarView({ events }: { events: any[] }) {
  const [current, setCurrent] = useState({ year: 2026, month: 8 })

  function goPrev() {
    setCurrent(({ year, month }) =>
      month === 0
        ? { year: year - 1, month: 11 }
        : { year, month: month - 1 }
    )
  }

  function goNext() {
    setCurrent(({ year, month }) =>
      month === 11
        ? { year: year + 1, month: 0 }
        : { year, month: month + 1 }
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <button onClick={goPrev}>‹ Anterior</button>
        <span style={{ fontWeight: 'bold', minWidth: '160px', textAlign: 'center' }}>
          {MESES[current.month]} {current.year}
        </span>
        <button onClick={goNext}>Siguiente ›</button>
      </div>

      <MonthCalendar year={current.year} month={current.month} events={events} />
    </div>
  )
}
