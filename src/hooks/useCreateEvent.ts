import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsService } from '../services/events.service'

export function useCreateEvent(teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      resourceId: string;
      title: string;
      startsAt: string;
      endsAt: string;
      assignedTo?: string | null
    }) => eventsService.create({ teamId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', teamId] })
    },
  })
}
