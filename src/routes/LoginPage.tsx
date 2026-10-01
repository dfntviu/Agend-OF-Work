import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth.service'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSignUp() {
    const { error } = await authService.signUp(email, password)
    if (error) return setError(error.message)
    setError('Usuario creado, ahora inicia sesión')
  }

  async function handleLogin() {
    const { error } = await authService.signIn(email, password)
    if (error) return setError(error.message)
    navigate('/')
  }

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
      <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="password" />
      <button onClick={handleLogin}>Entrar</button>
      <button onClick={handleSignUp}>Registrarse</button>
      {error && <p>{error}</p>}
    </div>
  )
}
