import prisma from "../prisma/client.js";

export async function isAdmin(req, res) {
    try {
        if (!req.user) {
            return res.status(200).json({ isAdmin: false });
        }

        const admin = await prisma.role.findUnique({
            where: {
                rolename: "ADMIN",
            }
        })

        const findAdmin = await prisma.userRole.findUnique({
            where: {
                userId_roleId:{
                    userId: req.user.id,
                    roleId: admin.id,
                }
            }
        })

        console.log(req.user , findAdmin);

        if (!findAdmin) return res.status(200).json({ isAdmin: false });
        else return res.status(200).json({ isAdmin: true });
    } catch (error) {
        return res.status(500).json({ message: "internal server error." })
    }
}

export async function isProvider(req, res) {
    try {
        if (!req.user) {
            return res.status(200).json({ isProvider: false });
        }

        const provider = await prisma.role.findUnique({
            where: {
                rolename: "PROVIDER",
            }
        })

        const findprovider = await prisma.userRole.findUnique({
            where: {
                userId_roleId:{
                    userId: req.user.id,
                    roleId: provider.id,
                }
            }
        })

        if (!findprovider) return res.status(200).json({ isProvider: false });
        else return res.status(200).json({ isProvider: true });
    } catch (error) {
        return res.status(500).json({ message: "internal server error." })
    }
}