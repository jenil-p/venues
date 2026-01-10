import prisma from "../../prisma/client.js";

export async function getVenues(req , res) {
    const venues = await prisma.venue.findMany({
        select: {
            venuename: true,
            rating: true,
            photos: {
                select: { image: true },
                where: { order: 1 }
            },
            pricing: {
                select: { price: true },
                where: { unit: "DAILY" }
            },  
        },
        where: {
            status: "ACTIVE"
        }
    })
    
    return res.status(200).json({ message: "venues fatched successfully.", data: venues })
}