import prisma from "../../prisma/client.js";

export async function assignPermission(req, res, next) {
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

    let permissionUser = await prisma.rolePermission.findUnique({
      where: {
        roleId_tableId_operationId: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      }
    });

    if (!permissionUser) {
      permissionUser = await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      });
    } else if (permissionUser.isDeleted) {
      await prisma.rolePermission.update({
        where: {
          roleId_tableId_operationId: {
            roleId: role.id,
            tableId: table.id,
            operationId: op.id
          }
        },
        data: {
          isDeleted: false,
        }
      });
    } else {
      return res.status(409).json({ message: "Permission already exitns ..." });
    }

    req.objectId = permissionUser.id;

    res.json({ message: "Permission granted" });

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function deAssignPermission(req, res, next) {
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

    const permissionUser = await prisma.rolePermission.findUnique({
      where: {
        roleId_tableId_operationId: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      }
    });

    if (!permissionUser || permissionUser.isDeleted)
      return res.status(404).json({ message: "This permission does not exists!" });

    await prisma.rolePermission.update({
      where: {
        roleId_tableId_operationId: {
          roleId: role.id,
          tableId: table.id,
          operationId: op.id
        }
      },
      data: {
        isDeleted: true,
      }
    });
    
    req.objectId = permissionUser.id;

    res.json({ message: "Permission taken ..." });
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}