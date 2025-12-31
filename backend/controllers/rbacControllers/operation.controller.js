import prisma from "../../prisma/client.js";

export async function createOperation(req, res) {
    try {
        const { operationname } = req.body;

        const exists = await prisma.operation.findUnique({
            where: {
                operationname
            }
        });

        if (exists) return res.status(400).json({ message: "Operation exists" });

        const op = await prisma.operation.create({
            data: {
                operationname
            }
        });

        res.json({ message: "Operation added", op });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
