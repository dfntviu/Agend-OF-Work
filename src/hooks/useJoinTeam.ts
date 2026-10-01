import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipsService } from "../services/memberships.service";

 export function useJoinTeam(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (inviteCode: string) => membershipsService.joinByCode(inviteCode),
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey: ['teams']})
        },
    })
 }