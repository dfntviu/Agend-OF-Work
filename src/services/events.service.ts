import { supabase } from '../lib/supabase'

export const eventsService = {
  getByTeam: async (teamId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('team_id', teamId)
      .order('starts_at', { ascending: true })
    if (error) throw error
    return data
  },

  create: async (params: {
    teamId: string
    resourceId: string
    title: string
    startsAt: string
    endsAt: string
    assignedTo?: string | null //*
  }) => {
    const { data: u } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('events')
      .insert({
        team_id: params.teamId,
        resource_id: params.resourceId,
        created_by: u.user!.id,
        assigned_to: params.assignedTo || null, //*
        title: params.title,
        starts_at: params.startsAt,
        ends_at: params.endsAt,
      })
    if (error) throw error
    return data
  },

  update: async (eventId: string, changes: { title?: string; startsAt?: string; endsAt?: string; assignedTo?: string | null }) =>{
      const payload: any = {}

      if (changes.title!==undefined)  payload.title = changes.title
      if (changes.startsAt!==undefined)  payload.starts_at = changes.startsAt
      if (changes.endsAt!==undefined)  payload.ends_at = changes.endsAt
      if (changes.assignedTo!==undefined)  payload.assigned_to = changes.assignedTo || null //*new
      

        const {error} = await supabase
            .from('events').update(payload).eq('id', eventId)
             if (error) throw error
  
  },
  
  remove: async (eventId: string) => {
        const {error} = await supabase.from('events').delete().eq('id',eventId)
        if(error) throw error;
  },
  
}
