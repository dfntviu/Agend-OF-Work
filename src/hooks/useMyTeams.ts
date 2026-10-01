import { useQuery } from '@tanstack/react-query'
import { teamsService } from '../services/teams.service'

export function useMyTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsService.getMyTeams,
  })
}
