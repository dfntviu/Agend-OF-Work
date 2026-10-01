import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'

const NAV = [
  { to: '/',          label: 'Mis equipos',  icon: 'ti-users' },
  { to: '/calendar',  label: 'Calendario',   icon: 'ti-calendar' },
  { to: '/teams',      label: 'Mí Equipo',    icon: 'ti-user-plus' },  //Añadido, perfiles de Supabase
  { to: '/dashboard', label: 'Estadísticas', icon: 'ti-box' }, // Añadido, recientemente
  { to: '/resources', label: 'Mis Recursos', icon: 'ti-box' },
]

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
      console.log('La barra de Navegación es funcional');
  async function handleLogout() {
    await authService.signOut()
    navigate('/login')
  }

  return (

    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '200px', background: '#3D6FB0', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px 16px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-calendar-event" style={{ fontSize: '16px', color: '#fff' }} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Agenda</span>
        </div>
        {NAV.map(item => {
          const activo = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
                borderRadius: '8px', fontSize: '14px', textDecoration: 'none',
                background: activo ? '#fff' : 'transparent',
                color: activo ? '#2C5990' : 'rgba(255,255,255,0.82)',
                fontWeight: activo ? 500 : 400,
              }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: '18px' }} />
              {item.label}
            </Link>
          )
        })}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '0.5px solid rgba(255,255,255,0.2)' }}>
          <button onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
              borderRadius: '8px', fontSize: '14px', background: 'transparent', border: 'none',
              cursor: 'pointer', color: 'rgba(255,255,255,0.82)', width: '100%', textAlign: 'left',
            }}>
            <i className="ti ti-logout" style={{ fontSize: '18px' }} />
            Salir
          </button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '24px', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  )
}
