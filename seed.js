/**
 * seed.js — Poblador de datos de prueba para "Agenda de equipo"
 * ------------------------------------------------------------------
 * USO (local, una sola vez):
 *   1. Crea un archivo .env.seed junto a este, con:
 *        SUPABASE_URL=https://TU_PROYECTO.supabase.co
 *        SUPABASE_SERVICE_ROLE_KEY=eyJ...   (la clave SECRETA de admin)
 *   2. npm install @supabase/supabase-js dotenv
 *   3. node seed.js
 *
 * SEGURIDAD: .env.seed NUNCA se sube a Git ni a Vercel. Agrégalo a .gitignore.
 * La service_role key salta toda la seguridad RLS: es solo para esto, local.
 *
 * IDENTIFICABLE: todo lo que crea lleva el prefijo "Demo_" o email @demo.seed
 * para poder borrarlo después (ver seed-clean.sql).
 * ------------------------------------------------------------------
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.seed' })
import { createClient } from '@supabase/supabase-js'

// --- carga de configuración desde .env.seed ---
const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.seed')
  process.exit(1)
}

// cliente ADMIN (service_role) — puede crear usuarios y saltar RLS
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// --- cantidades (según lo acordado) ---
const N_USERS = 100
const N_TEAMS = 40
const N_RESOURCES = 80
const N_EVENTS = 100

// --- utilidades ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pad = (n) => String(n).padStart(2, '0')

const TIPOS_RECURSO = ['room', 'equipment', 'vehicle', 'other']

// fecha aleatoria dentro de los próximos 60 días, con duración de 1-3 horas
function fechaEvento() {
  const inicio = new Date()
  inicio.setDate(inicio.getDate() + randInt(0, 60))
  inicio.setHours(randInt(7, 18), pick([0, 30]), 0, 0)
  const fin = new Date(inicio)
  fin.setHours(inicio.getHours() + randInt(1, 3))
  return { starts_at: inicio.toISOString(), ends_at: fin.toISOString() }
}

async function main() {
  console.log('== Sembrando datos de prueba ==\n')

  // ---------- 1) USUARIOS ----------
  console.log(`Creando ${N_USERS} usuarios...`)
  const userIds = []
  for (let i = 1; i <= N_USERS; i++) {
    const email = `demo_usuario_${pad(i)}@demo.seed`
    const displayname = `Demo_Usuario_${pad(i)}`
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: 'Demo1234!',
      email_confirm: true, // ya confirmado, sin enviar correo
      user_metadata: { display_name: displayname },
    })
    if (error) {
      console.warn(`  usuario ${i} falló: ${error.message}`)
    } else {
      userIds.push(data.user.id)
    }
    await sleep(120) // respiro anti-rate-limit
    if (i % 20 === 0) console.log(`  ...${i}/${N_USERS}`)
  }
  console.log(`  ${userIds.length} usuarios creados.\n`)

  // El trigger handle_new_user ya creó su fila en profiles automáticamente.

  // ---------- 2) EQUIPOS ----------
  console.log(`Creando ${N_TEAMS} equipos...`)
  const teamRows = []
  for (let i = 1; i <= N_TEAMS; i++) {
    teamRows.push({
      name: `Demo_Equipo_${pad(i)}`,
      code: `DEMO${pad(i)}${randInt(100, 999)}`,
      owner_id: pick(userIds), // un usuario aleatorio es el dueño
    })
  }
  const { data: teams, error: teamsErr } = await admin.from('teams').insert(teamRows).select()
  if (teamsErr) { console.error('Error creando equipos:', teamsErr.message); process.exit(1) }
  console.log(`  ${teams.length} equipos creados.\n`)

  // ---------- 3) MEMBRESÍAS (distribución VARIADA) ----------
  // el trigger handle_new_team YA creó la membresía de owner de cada equipo.
  // aquí añadimos MÁS miembros, en cantidad variada por equipo.
  console.log('Creando membresías (distribución variada)...')
  const memberRows = []
  const yaEnEquipo = new Set(teams.map((t) => `${t.id}:${t.owner_id}`)) // owners ya están

  for (const team of teams) {
    // número variado de miembros extra: algunos equipos 1, otros hasta 12
    const extra = randInt(1, 12)
    for (let j = 0; j < extra; j++) {
      const uid = pick(userIds)
      const clave = `${team.id}:${uid}`
      if (yaEnEquipo.has(clave)) continue // evitar duplicados (unique team_id+user_id)
      yaEnEquipo.add(clave)
      memberRows.push({
        team_id: team.id,
        user_id: uid,
        role: pick(['member', 'member', 'member', 'admin']), // mayoría member, algunos admin
      })
    }
  }
  // insertar en lotes de 100 para no saturar
  for (let i = 0; i < memberRows.length; i += 100) {
    const lote = memberRows.slice(i, i + 100)
    const { error } = await admin.from('memberships').insert(lote)
    if (error) console.warn(`  lote de membresías falló: ${error.message}`)
  }
  console.log(`  ${memberRows.length} membresías extra creadas.\n`)

  // ---------- 4) RECURSOS ----------
  console.log(`Creando ${N_RESOURCES} recursos...`)
  const resourceRows = []
  for (let i = 1; i <= N_RESOURCES; i++) {
    resourceRows.push({
      team_id: pick(teams).id,
      name: `Demo_Recurso_${pad(i)}`,
      type: pick(TIPOS_RECURSO),
    })
  }
  const { data: resources, error: resErr } = await admin.from('resources').insert(resourceRows).select()
  if (resErr) { console.error('Error creando recursos:', resErr.message); process.exit(1) }
  console.log(`  ${resources.length} recursos creados.\n`)

  // ---------- 5) EVENTOS ----------
  console.log(`Creando ${N_EVENTS} eventos...`)
  const eventRows = []
  for (let i = 1; i <= N_EVENTS; i++) {
    // elegir un equipo, y un recurso DE ESE equipo (respetar la relación)
    const team = pick(teams)
    const recursosDelEquipo = resources.filter((r) => r.team_id === team.id)
    if (recursosDelEquipo.length === 0) continue // ese equipo no tiene recursos, saltar
    const { starts_at, ends_at } = fechaEvento()
    eventRows.push({
      team_id: team.id,
      resource_id: pick(recursosDelEquipo).id,
      created_by: team.owner_id,        // el dueño lo creó (siempre es miembro)
      assigned_to: Math.random() < 0.7 ? pick(userIds) : null, // 70% asignados
      title: `Demo_Evento_${pad(i)}`,
      starts_at,
      ends_at,
    })
  }
  for (let i = 0; i < eventRows.length; i += 100) {
    const lote = eventRows.slice(i, i + 100)
    const { error } = await admin.from('events').insert(lote)
    if (error) console.warn(`  lote de eventos falló: ${error.message}`)
  }
  console.log(`  ${eventRows.length} eventos creados.\n`)

  console.log('== Siembra completa ==')
  console.log('Todo lo creado lleva prefijo Demo_ / @demo.seed y es identificable.')
}

main().catch((e) => { console.error('Error fatal:', e); process.exit(1) })
