import { IRoleInput } from "../../../interfaces/IRole.interface";

export const rolesData: IRoleInput[] = 
[
    {
        name:"Owner",
        modules:["entradas", "saidas", "relatoriosfinanceiros"],
        permissions:["create", "read", "update", "delete"],
        description:"Dono/Criador do Workspace"
    },
    {
        name:"Accountant",
        modules:["entradas", "saidas", "relatoriosfinanceiros"],
        permissions:["create", "read", "update", "delete"],
        description:"Contador do Workspace"
    },
    {
        name:"Employee",
        modules:["entradas", "saidas", "relatoriosfinanceiros"],
        permissions:["create", "read", "update", "delete"],
        description:"Colaborador do Workspace"
    },
]
