import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipsService } from "../services/memberships.service";

  export function useUpdateRole(teamId:string) {
    const queryClient = useQueryClient();

        return useMutation(
            {
                mutationFn: ({ membershipId, newRole}: {membershipId: string; newRole: string}) =>
                    membershipsService.updateRole(membershipId,newRole),
                 onSuccess: () => queryClient.invalidateQueries({queryKey: ['members', teamId]}),
            }
        )
  }