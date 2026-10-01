import { supabase } from '../lib/supabase'

export const resourcesService = {
  getByTeam: async (teamId: string) => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('team_id', teamId)
      .order('name')
    if (error) throw error
    return data
  },

  create: async (teamId: string, name: string, type: string) => {
    const { data, error } = await supabase
      .from('resources')
      .insert({ team_id: teamId, name, type })
      .select()
      .single()
    if (error) throw error
    return data
  },

   update: async (resourseId: string,name: string, type: string) => {
    const {  error } = await supabase
      .from('resources')
      .update({ name, type }).eq('id', resourseId)
    if (error) throw error
  },

  remove: async (resourseId: string) => {
    const {  error } = await supabase
      .from('resources').delete().eq('id', resourseId)
    if (error) throw error
  },

}