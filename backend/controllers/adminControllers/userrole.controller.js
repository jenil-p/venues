import prisma from "../../prisma/client.js";

export async function assignRoleToUser(req, res, next) {
    try {
        const { contactnumber, rolename } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                contactnumber: contactnumber,
            }
        })

        const role = await prisma.role.findUnique({
            where: {
                rolename: rolename,
            }
        })

        if (!user || !role) {
            return res.status(400).json({ message: "invalid matadata" });
        }

        if(rolename == "ADMIN" || rolename == "SUPER_ADMIN"){
            return res.status(401).json({ message: "you are not authorized to do this operation."});
        }

        let userrole = await prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId: user.id,
                    roleId: role.id
                }
            }
        })

        if (!userrole) {
            userrole = await prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: role.id,
                    isDeleted: false,
                }
            })
        } else if (userrole.isDeleted) {
            await prisma.userRole.update({
                where: {
                    userId_roleId: {
                        userId: user.id,
                        roleId: role.id,
                    }
                },
                data: {
                    isDeleted: true
                },
            })
        } else {
            return resstatus(409).json({ message: "User already has this role" });
        }


        req.objectId = userrole.id;

        res.status(200).json({ message: "user assigned the role successfully." })
        next();
    } catch (err) {
        return res.status(400).json({ message: "error occured ...", err });
    }
}

export async function deAssignRoleFromUser(req, res, next) {
    try {
        const { contactnumber, rolename } = req.body;

        const user = await prisma.user.findUnique({
            where: { contactnumber }
        });

        const role = await prisma.role.findUnique({
            where: { rolename }
        });

        if (!user || !role) {
            return res.status(400).json({ message: "Invalid metadata" });
        }
        
        if(rolename == "ADMIN" || rolename == "SUPER_ADMIN"){
            return res.status(401).json({ message: "you are not authorized to do this operation."});
        }

        let userRole = await prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId: user.id,
                    roleId: role.id
                }
            }
        });

        if (!userRole || userRole.isDeleted) {
            return res.status(404).json({ message: "User does not have this role" });
        }

        await prisma.userRole.update({
            where: {
                userId_roleId: {
                    userId: user.id,
                    roleId: role.id
                }
            },
            data: {
                isDeleted: true
            }
        });

        req.objectId = userRole.id;

        res.status(200).json({message: "role de-assigned from user sucessfully..."});
        next();
    } catch (err) {
        return res.status(400).json({ message: "Error occurred", err });
    }
}