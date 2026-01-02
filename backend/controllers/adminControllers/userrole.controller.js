import prisma from "../../prisma/client.js";

export async function assignRoleToUser(req , res){
    try {
        const { contactnumber , rolename } = req.body;
    
        const user = await prisma.user.findUnique({
            where : {
                contactnumber : contactnumber,
            }
        })
    
        const role = await prisma.role.findUnique({
            where : {
                rolename : rolename,
            }
        })
        
        if(!user || !role){
            return res.status(400).json({message : "invalid matadata"});
        }

        const userrole = await prisma.userRole.findUnique({
            where : {
                userId_roleId : {
                    userId : user.id,
                    roleId : role.id
                }
            }
        })
    
        if(userrole){
            return res.status(409).json({ message : "this user is already assigned with this role." })
        }
    
        await prisma.userRole.create({
            data : {
                userId : user.id,
                roleId : role.id,
                isDeleted : false,
            }
        })
    
        return res.status(200).json({ message : "user assigned the role successfully." })
    } catch (err) {
        return res.status(400).json({ message : "error occured ..." , err });
    }
}

export async function deAssignRoleFromUser(req , res){
    try {
        const { contactnumber , rolename } = req.body;
    
        const user = await prisma.user.findUnique({
            where : {
                contactnumber : contactnumber,
            }
        })
    
        const role = await prisma.role.findUnique({
            where : {
                rolename : rolename,
            }
        })

        if(!user || !role){
            return res.status(400).json({message : "invalid matadata"});
        }
    
        const userrole = await prisma.userRole.findUnique({
            where : {
                userId_roleId : {
                    userId : user.id,
                    roleId : role.id
                }
            }
        })
    
        if(!userrole){
            return res.status(404).json({ message : "this user is not assigned to this role ..." })
        }
    
        await prisma.userRole.update({
            where : {
                userId_roleId : {
                    userId : user.id,
                    roleId : role.id,
                }
            },
            data : {
                isDeleted : true
            },
        })
    
        return res.status(200).json({ message : "user de-assigned the role successfully." })
    } catch (err) {
        return res.status(400).json({ message : "error occured ..." , err });
    }
}