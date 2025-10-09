import { IRoleInput } from "../../../interfaces/IRole.interface";

export const rolesData: IRoleInput[] = 
[
    {
        name:"Owner",
        modules:["entradas", "saidas", "relatoriosfinanceiros"],
        permissions:["create", "read", "update", "delete"],
        description:"Dono/Criados do Wokspace"
    },
    {
        name:"Accountant",
        modules:["entradas", "saidas", "relatoriosfinanceiros"],
        permissions:["create", "read", "update", "delete"],
        description:"Dono/Criados do Wokspace"
    },
    {
        name:"Employee",
        modules:["entradas", "saidas", "relatoriosfinanceiros"],
        permissions:["create", "read", "update", "delete"],
        description:"Dono/Criados do Wokspace"
    },
]