import prisma from "../../prisma/client.js";

export async function createAppTable(req, res) {
  try {
    const { tablename, displayname } = req.body;

    const exists = await prisma.appTable.findUnique({
      where: {
        tablename
      }
    });

    if (exists) return res.status(400).json({ message: "Table already exists" });

    const table = await prisma.appTable.create({
      data: {
        tablename,
        displayname
      }
    });

    res.json({ message: "Module added", table });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
