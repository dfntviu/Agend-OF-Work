import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipsService } from "../services/memberships.service";

export function useRemoveMember(teamId:string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (membershipId: string) => membershipsService.removeMember(membershipId),
        onSuccess: () => queryClient.invalidateQueries({queryKey:['members', teamId]}),
    })
}