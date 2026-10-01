import { useQuery } from '@tanstack/react-query'
import { resourcesService } from '../services/resources.service'

export function useResources(teamId: string) {
  return useQuery({
    queryKey: ['resources', teamId],
    queryFn: () => resourcesService.getByTeam(teamId),
    enabled: !!teamId,
  })
}
