import prisma from "../../prisma/client.js";

export async function seeAllAdmins(req , res , next) {
    const adminRow = await prisma.role.findUnique({
        where:{
            rolename: "ADMIN",
        }
    })
    const admins = await prisma.userRole.findMany({
        where:{
            roleId: adminRow.id, 
        }
    });

    res.status(200).json({message: "admins are here : ", admins});

    next();
}

export async function seeAllUsers(req , res , next) {
    const users = await prisma.user.findMany({});

    res.status(200).json({message: "users are here : ", users});

    next();
}

export async function addAdmin(req , res , next) {
    const { userId } = req.params;

    const adminRow = await prisma.role.findUnique({
        where:{
            rolename: "ADMIN",
        }
    })

    const added = await prisma.userRole.create({
        data:{
            roleId : adminRow.id,
            userId : Number(userId),
        }
    })

    res.status(200).json({message: "Added admin", added});

    req.objectId = added.id;
    next();
}

export async function removeAdmin(req , res , next) {
    const { userId } = req.params;

    const adminRow = await prisma.role.findUnique({
        where:{
            rolename: "ADMIN"
        }
    })

    const userAdmin = await prisma.userRole.findUnique({
        where:{
            userId_roleId:{
                roleId : adminRow.id,
                userId : Number(userId),
            }
        }
    })

    if(!userAdmin || userAdmin.isDeleted == true){
        return res.status(404).json({ message: "user is not an admin."})
    }

    const deletedAdmin = await prisma.userRole.update({
        where:{
            userId_roleId:{
                roleId : adminRow.id,
                userId : Number(userId),
            }
        },
        data: {
            isDeleted : true,
        }
    })

    req.objectId = deletedAdmin.id;
    next();

    res.status(200).json({ message: "Successfully deleted." , deletedAdmin});
}