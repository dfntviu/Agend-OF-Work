import { useQuery } from '@tanstack/react-query'
import { eventsService } from '@/services/events.service'

export function useEvents(teamId: string) {
  return useQuery({
    queryKey: ['events', teamId],
    queryFn: () => eventsService.getByTeam(teamId),
    enabled: !!teamId,
  })
}
