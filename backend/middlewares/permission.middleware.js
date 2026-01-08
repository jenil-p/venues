import prisma from "../prisma/client.js";

export const hasPermission = (tableName, operationName) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user){
                return res.status(401).json({ message: "Not authenticated" });
            }
            
            const roles = await prisma.userRole.findMany({
                where: {
                    userId: user.id,
                    isDeleted: false,
                }
            });

            if (!roles.length){
                return res.status(403).json({ message: "No roles assigned" });
            }

            const table = await prisma.appTable.findUnique({
                where: {
                    tablename: tableName
                }
            });

            const op = await prisma.operation.findUnique({
                where: {
                    operationname: operationName
                }
            });

            if (!table || !op){
                return res.status(500).json({ message: "Invalid metadata" });
            }

            const allowed = await prisma.rolePermission.findFirst({
                where: {
                    tableId: table.id,
                    operationId: op.id,
                    roleId: { in: roles.map(r => r.roleId) },
                    isDeleted: false
                }
            });

            if (!allowed){
                return res.status(403).json({ message: "Permission denied" });
            }

            next();
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Permission check failed" });
        }
    };
};
