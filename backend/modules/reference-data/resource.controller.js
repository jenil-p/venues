import prisma from "../../prisma/client.js";

export async function getVenueTypes(req, res) {
    try {
        const types = await prisma.typeOfVenue.findMany({
            select: { id: true, name: true, icon: true }
        });
        return res.status(200).json({ types });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching types", error: err.message });
    }
}

export async function getVenueFeatures(req, res) {
    try {
        const features = await prisma.feature.findMany({
            select: { id: true, name: true, icon: true }
        });
        return res.status(200).json({ features });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching features", error: err.message });
    }
}

export async function getLocationOptions(req, res) {
    try {
        const locations = await prisma.state.findMany({
            include: {
                cities: {
                    select: { id: true, name: true }
                }
            }
        });
        return res.status(200).json({ locations });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching locations", error: err.message });
    }
}

export async function getAllVenueFormOptions(req, res) {
    try {
        const [types, features, locations] = await Promise.all([
            prisma.typeOfVenue.findMany({ select: { id: true, name: true, icon: true } }),
            prisma.feature.findMany({ select: { id: true, name: true, icon: true } }),
            prisma.state.findMany({
                include: {
                    cities: { select: { id: true, name: true } }
                }
            })
        ]);

        return res.status(200).json({
            types,
            features,
            locations
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching form options", error: err.message });
    }
}

export async function getAllServiceCategories(req, res) {
    try {
        const categories = await prisma.serviceCategory.findMany({
            select: { id: true, name: true }
        });
        return res.status(200).json({ categories });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching categories", error: err.message });
    }
}