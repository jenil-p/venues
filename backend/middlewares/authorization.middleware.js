import prisma from '../prisma/client.js';

export const isAdmin = async (req, res, next) => {

    const user = req.user; // collect that user ...

    const admin = await prisma.role.findUnique({
        where: {
            rolename: 'admin'
        }
    })

    const userIsAdmin = await prisma.userRole.findUnique({
        where: {
            userId_roleId: {
                userId: user.id,
                roleId: admin.id
            }
        }
    });

    if (!userIsAdmin) {
        return res.status(401).json({ message: "un-authorizes access..." });
    }

    next();
};
