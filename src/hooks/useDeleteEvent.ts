import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsService } from '../services/events.service'

export function useDeleteEvent(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) => eventsService.remove(eventId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events', teamId] }),
  })
}
