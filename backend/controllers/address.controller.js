import prisma from "../prisma/client.js";

export async function getCity(req , res) {
    try {
        const cities = await prisma.city.findMany({
            select: {
                id: true,
                name: true,
            }
        })
    
        return res.status(200).json({ cities });
    } catch (error) {
        return res.status(500).json({ message: "internal server error." });
    }
}