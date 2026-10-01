import { useQuery } from '@tanstack/react-query'
import { profilesService } from '../services/profiles.service'

export function useProfiles() {
  return useQuery({ queryKey: ['profiles'], queryFn: profilesService.getAll })
}
