import prisma from "../../prisma/client.js";

export async function assignPermission(req, res) {
  try {
    const { roleName, tableName, operationName } = req.body;

    const role = await prisma.role.findUnique({
      where: {
        rolename: roleName
      }
    });
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

    if (!role || !table || !op)
      return res.status(404).json({ message: "Role/Table/Operation missing" });

    const exist = await prisma.rolePermission.findUnique({
      where: {
        roleId_tableId_operationId: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      }
    });

    if (exist)
      await prisma.rolePermission.update({
      where : {
        roleId_tableId_operationId: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      },
      data : {
        isDeleted : false,
      }
    });
      return res.status(409).json({ message: "Permission Granted" });

    await prisma.rolePermission.create({
      data: {
        roleId: role.id,
        tableId: table.id,
        operationId: op.id
      }
    });

    res.json({ message: "Permission granted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function deAssignPermission(req, res) {
  try {
    const { roleName, tableName, operationName } = req.body;

    const role = await prisma.role.findUnique({
      where: {
        rolename: roleName
      }
    });
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

    if (!role || !table || !op)
      return res.status(404).json({ message: "Role/Table/Operation missing" });

    const exist = await prisma.rolePermission.findUnique({
      where: {
        roleId_tableId_operationId: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      }
    });

    if (!exist)
      return res.status(409).json({ message: "This permission does not exists!" });

    await prisma.rolePermission.update({
      where : {
        roleId_tableId_operationId: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      },
      data : {
        isDeleted : true,
      }
    });

    res.json({ message: "Permission taken ..." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}