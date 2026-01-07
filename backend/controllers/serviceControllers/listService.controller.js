import prisma from "../../prisma/client.js";

export async function listService(req, res) {
    try {
        const userId = req.user.id;

        const { name, description, basePrice, categoryId, providerId, cityId } = req.body;

        const provider = await prisma.providerProfile.findUnique({
            where: { userId }
        });

        if (!provider || provider.status !== "APPROVED") {
            return res.status(403).json({ message: "Only approved providers can list services" });
        }

        if ( !name || !description || !basePrice || !categoryId || !providerId || !cityId) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        const service = await prisma.service.create({
            data: {
                name, description, basePrice, categoryId, providerId, cityId
            }
        });

        return res.status(201).json({ message: "service created successfully", serviceId: service.id });

    } catch (err) {
        return res.status(400).json({ message: "Error creating service", err });
    }
}

export async function updateService(req, res) {
    try {
        const userId = req.user.id;

        const { serviceId } = req.params;

        const service = await prisma.service.update({
            where:{
                id: Number(serviceId),
            },
            data: req.body
        });

        return res.status(201).json({ message: "service updated successfully", serviceId: service.id });

    } catch (err) {
        return res.status(400).json({ message: "Error updating service", err });
    }
}
