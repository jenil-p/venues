import prisma from "../prisma/client.js";

export const logAction = (tableName, operationName, objectIdField) => {
  return (req, res, next) => {

    res.on("finish", () => {
      if (res.statusCode >= 300) return;

      (async () => {
        try {
          let objectId = null;

          if (objectIdField && req.params && req.params[objectIdField]) {
            objectId = Number(req.params[objectIdField]);
          } else if (req.objectId) {
            objectId = Number(req.objectId);
          }

          const table = await prisma.appTable.findUnique({
            where: { tablename: tableName }
          });

          const op = await prisma.operation.findUnique({
            where: { operationname: operationName }
          });

          await prisma.actionLog.create({
            data: {
              userId: req.user.id,
              tableId: table.id,
              operationId: op.id,
              operationObjectID: objectId
            }
          });
        } catch (err) {
          console.error("action log error : ", err);
        }
      })();
    });

    next();
  };
};
