import prisma from "../../prisma/client.js";

export async function approveVenue(req, res, next) {
    try {
        const { venueId } = req.params;

        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId),
            }
        })

        if (!venue || venue.status === "ACTIVE") {
            return res.status(404).json({ message: "invalid venue approval request!" });
        }

        const provider = 

        await prisma.venue.update({
            where: {
                id: Number(venueId),
            },
            data: {
                status: "ACTIVE",
            }
        })

        req.objectId = venue.id;

        res.status(200).json({ message: "venue approved successfully." });
        next();
    }
    catch (err) {
        return res.status(400).json({ message: "error approving venue" });
    }
}


export async function rejectVenue(req, res, next) {
    try {
        const { venueId } = req.params;

        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId),
            }
        })

        if (!venue || venue.status === "BLOCKED") {
            return res.status(404).json({ message: "invalid venue approval request!" });
        }

        await prisma.venue.update({
            where: {
                id: Number(venueId),
            },
            data: {
                status: "BLOCKED",
            }
        })

        req.objectId = venue.id;

        res.status(200).json({ message: "venue rejected successfully." });
        next();
    }
    catch (err) {
        return res.status(400).json({ message: "error rejecting venue" });
    }
}


export async function getAllVenues(req, res, next) {
    try {
        const venues = await prisma.venue.findMany({})
        
        res.status(200).json({ venues });
        next();
    }
    catch (err) {
        return res.status(400).json({ message: "error fatching venues." });
    }
}


export async function getVenue(req, res, next) {
    try {
        const { venueId } = req.params;

        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId),
            },
            include: {
                address : true,
                features : true,
                provider : true,
                photos : true,
                pricing : true,
                types : true,                
            }
        })

        if(!venue){
            return res.status(400).json({ message: "venue not found." });
        }

        req.objectId = venue.id;

        res.status(200).json({ venue });
        next();
    } catch (err) {
        return res.status(400).json({ message: "failed getting venue" });
    }
}


export async function deleteVenue(req, res, next) {
    try {
        const { venueId } = req.params;

        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId),
            }
        })

        if(!venue){
            return res.status(400).json({ message: "venue not found." });
        }

        if(venue.status === "DELETED"){
            return res.status(400).json({ message: "venue has already been deleted." });
        }

        await prisma.venue.update({
            where: {
                id: Number(venueId),
            },
            data: {
                status:  "DELETED",
            }
        })

        req.objectId = venue.id;

        res.status(200).json({message: "venue deleted successfully.", venue });
        next();
    } catch (err) {
        return res.status(400).json({ message: "failed deleting venue" });
    }
}