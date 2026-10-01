import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js'
import { useEvents } from '@/hooks/useEvents'
import { useProfiles } from '@/hooks/useProfiles'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function Dashboard({ teamId }: { teamId: string }) {
  const { data: events = [] } = useEvents(teamId)
  const { data: profiles = [] } = useProfiles()

  const conteoPorUsuario = events.reduce((acc: any, ev: any) => {
    acc[ev.created_by] = (acc[ev.created_by] || 0) + 1
    return acc
  }, {})

  const nombrePorId = profiles.reduce((acc: any, p: any) => {
    acc[p.id] = p.display_name
    return acc
  }, {})

  const uuids = Object.keys(conteoPorUsuario)
  const labels = uuids.map(id => nombrePorId[id] || 'Desconocido')
  const valores = uuids.map(id => conteoPorUsuario[id])

  const data = {
    labels: labels,
    datasets: [
      { label: 'Eventos por miembro', data: valores, backgroundColor: '#3b82f6' },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Eventos por miembro' },
    },
  }

  return (
    <div style={{ maxWidth: '600px', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  )
}
