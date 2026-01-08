import prisma from "../../prisma/client.js";

export async function addRole(req, res, next) {
    const { rolename } = req.body;

    try {
        const isRole = await prisma.role.findUnique({
            where: {
                rolename: rolename,
            }
        })
        if (isRole) {
            return res.status(409).json({ message: "role already exists ..." });
        }

        const role = await prisma.role.create({
            data: {
                rolename: rolename,
            }
        })

        req.objectId = role.id; // for action log table ...

        res.status(200).json({ message: "Role added successfully ..." , role});

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteRole(req, res, next) {
    const { roleId } = req.params;
    
    try{
        const isRole = await prisma.role.findUnique({
            where: {
                id : Number(roleId)
            }
        })
    
        if (!isRole) {
            return res.status(404).json({ message: "could not found this role..." });
        }
    
        const deleteRole = await prisma.role.delete({
            where: {
                id: Number(roleId),
            }
        })

        req.objectId = Number(roleId); // for action log table...
        res.status(200).json({ message: "role deleted successfully ...", deleteRole });
        next();
    }catch(err){
        return res.status(500).json({ error: err.message });
    }
}