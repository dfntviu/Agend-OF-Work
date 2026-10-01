
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from './routes/LoginPage'
import { DashboardPage } from './routes/DashboardPage'
import { Layout } from './components/Layout'
import { ResourcesPage } from './routes/ResourcesPage'
import { CalendarPage } from './routes/CalendarPage'
import { StatsPage } from './routes/StatsPage'  // nueva [trabajo de] -> 2026/Sept/09
 import { TeamPage } from './routes/TeamPage'

const queryClient = new QueryClient();

function App() {
    return (
    <>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout/>}>
                <Route path="/" element={<DashboardPage />} />
                <Route path='/calendar' element={<CalendarPage />} />
                <Route path="/resources" element={<ResourcesPage />} ></Route>
                <Route path="/dashboard" element={<StatsPage/>}/>
                 <Route path='/teams' element={<TeamPage/>} ></Route> 
              </Route> 
                 {/* <Route path="/dashboard" element={<ResourcesPage />} ></Route>   (aun falta) */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
    </>
    // no reconoce el codigo aplicado en supabase en file: memberships.service, en supabase si lo reconoce
  )
}

export default App