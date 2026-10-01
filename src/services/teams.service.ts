import { supabase } from '../lib/supabase'

export const teamsService = {
  getMyTeams: async () => {
    // RLS filtra: devuelve solo los equipos donde soy miembro
    const { data, error } = await supabase.from('teams').select('*')
    if (error) throw error
    return data
  },

  createTeam: async (name: string, code: string) => {
    const { data: u } = await supabase.auth.getUser()
    // console.log('el owner_id que voy a mandar es: ', u.user?.id);
    const { data, error } = await supabase
      .from('teams')
      .insert({ name, code, owner_id: u.user!.id })
      // .select()
      // .single()
    if (error) throw error
    return data
  },
}
