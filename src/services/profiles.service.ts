import { supabase } from '@/lib/supabase'

export const profilesService = {
  getAll: async () => {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) throw error
    return data
  },

  // Fue reconstruido el script main del manejador de BD, para tomar la configuracion original
}