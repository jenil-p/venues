import prisma from "../../prisma/client.js";

export async function createAppTable(req, res, next) {
  try {
    const { tablename, displayname } = req.body;

    const exists = await prisma.appTable.findUnique({
      where: {
        tablename
      }
    });

    if (exists) return res.status(409).json({ message: "Table already exists" });

    const table = await prisma.appTable.create({
      data: {
        tablename,
        displayname
      }
    });

    req.objectId = table.id;
    res.json({ message: "Module added", table });
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
