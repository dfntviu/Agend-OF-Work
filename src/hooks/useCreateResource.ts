import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesService } from "../services/resources.service";

        export function useCreateResource(teamId:string) {
             const queryClient = useQueryClient();

                return useMutation({
                    mutationFn: ({name, type}:  {name: string; type: string}) =>
                        resourcesService.create(teamId,name,type),
                    onSuccess: () => queryClient.invalidateQueries({queryKey: ['resources',teamId]})
                })
        }

        // descolapsed routes
        // Infuncional
        //  FUNCIONALES
         //   el selector individual por equipos
         //  La edicion, y eliminacion de eventos del calendario
        // DISENIO
            //  - Ausencia de Boton de Salida para la pagina principal
            // - Dimension del directorio general de App