import prisma from "../prisma/client.js";

export const logAction = (tableName, operationName, objectIdField) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      if (res.statusCode < 300) {
        try {
          const user = req.user;

          const table = await prisma.appTable.findUnique({ where: { tablename: tableName } });
          const op = await prisma.operation.findUnique({ where: { operationname: operationName } });

          await prisma.actionLog.create({
            data: {
              userId: user.id,
              tableId: table.id,
              operationId: op.id,
              operationObjectID: req.params[objectIdField] || 0
            }
          });
        } catch {}
      }
    });

    next();
  };
};
