pendientes
CAPA BASE (verificar/crear):
  - política UPDATE de memberships (cambiar rol)
  - política DELETE de memberships (expulsar)

CAPA SERVICE (agregar a memberships.service.ts):
  - updateRole(membershipId, nuevoRol)
  - remove(membershipId)

CAPA HOOKS (nuevos):
  - useUpdateRole
  - useRemoveMember

CAPA UI (modificar TeamPage):
  - botones por miembro: "Hacer admin"/"Hacer member" + "Expulsar"