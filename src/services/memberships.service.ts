import { supabase } from "../lib/supabase"


export const membershipsService = {
  getByTeam: async (teamId: string) => {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('team_id', teamId)
    if (error) throw error
    return data
  },

  joinByCode: async (inviteCode: string) => { 
    const { error } = await (supabase.rpc as any) ('join_team_by_code', { invite_code: inviteCode })
    if (error) throw error
    
  },
  //  Cambiar el rol de miembro
  updateRole: async (membershipId: string, newRole: string) =>{
    const {error} = await supabase
    .from('memberships')
    .update({role: newRole})
    .eq('id', membershipId)
    if (error) throw error
  },
  // expulsar a un miembro (borrar su membershipId)
  removeMember: async (membershipId: string) => {
    const {error}  = await supabase
    .from('memberships')
    .delete() 
    .eq('id',membershipId)
    if (error) throw error
  },
}