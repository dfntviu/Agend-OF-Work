import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resourcesService } from '../services/resources.service'

export function useUpdateResource(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, nombre, tipo }: { resourceId: string; nombre: string; tipo: string }) =>
      resourcesService.update(resourceId, nombre, tipo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources', teamId] }),
  })
}
