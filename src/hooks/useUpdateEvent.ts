import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsService } from '../services/events.service'

export function useUpdateEvent(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, changes }: {  
      eventId: string
      changes: { title?: string; startsAt?: string; endsAt?: string; assignedTo?: string | null }
    }) => eventsService.update(eventId, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events', teamId] }),
  })
}
