import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resourcesService } from '../services/resources.service'

export function useDeleteResource(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (resourceId: string) => resourcesService.remove(resourceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources', teamId] }),
  })
}
