import { useMutation, useQueryClient } from '@tanstack/react-query'
import { teamsService } from '@/services/teams.service'

export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, code }: { name: string; code: string }) =>
      teamsService.createTeam(name, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
