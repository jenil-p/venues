import prisma from "../prisma/client.js";

const CRITICAL_FIELDS = ["categoryId", "providerId", "cityId"];

export async function validateProviderServiceOwnership(req, res, next) {
    try {
        const user = req.user;

        const provider = await prisma.providerProfile.findUnique({
            where: {
                userId: user.id,
            }
        })

        if (!provider || provider.status !== "APPROVED") {
            return res.status(403).json({ message: "Only approved provider can manage services" });
        }

        const { serviceId } = req.params;

        const service = await prisma.service.findUnique({
            where: {
                id: Number(serviceId),
            }
        })

        if (!service) {
            return res.status(404).json({ message: "no service found." });
        }

        if (service.providerId != provider.id) {
            return res.status(403).json({ message: "You do not own this service" });
        }

        if (service.status === "BLOCKED" || service.status === "DELETED") {
            return res.status(404).json({ message: "This service is blocked or deleted." })
        }


        // check if provider is trying to update the critical fields...
        if (service.status === "ACTIVE" || service.status === "TEMPORARILY_UNAVAILABLE") {
            const bodyKeys = Object.keys(req.body || {});
            const isCriticalChange = bodyKeys.some(key =>
                CRITICAL_FIELDS.includes(key)
            );

            if (isCriticalChange) {

                await prisma.service.update({
                    where: { id: service.id },
                    data: { status: "PENDING" }
                });

                service.status = "PENDING";
            }
        }

        req.service = service;
        req.currentProvider = provider;
        next();

    } catch (err) {
        return res.status(500).json({ error: "validation of provider service ownership failed!" });
    }
};
