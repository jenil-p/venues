import prisma from "../prisma/client.js";

const CRITICAL_FIELDS = ["capacity", "addressId"];

export async function validateHostVenueOwnership(req, res, next) {
    try {
        const user = req.user;

        const host = await prisma.hostMaster.findUnique({
            where: {
                userId: user.id,
            }
        })

        if (!host || host.status !== "APPROVED") {
            return res.status(403).json({ message: "Only approved hosts can manage venues" });
        }

        const { venueId } = req.params;

        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId),
            }
        })

        if (!venue) {
            return res.status(400).json({ message: "no venue found." });
        }

        if (venue.status === "BLOCKED" || venue.status === "DELETED") {
            return res.status(404).json({ message: "This venue is blocked or deleted." })
        }

        if (venue.hostId != host.id) {
            return res.status(403).json({ message: "You do not own this venue" });
        }

        // check if host is trying to update the critical fields...
        if (venue.status === "ACTIVE" || venue.status === "UNDER_MAINTENANCE") {
            const bodyKeys = Object.keys(req.body || {});
            const isCriticalChange = bodyKeys.some(key =>
                CRITICAL_FIELDS.includes(key)
            );

            if (isCriticalChange) {

                await prisma.venue.update({
                    where: { id: venue.id },
                    data: { status: "PENDING" }
                });

                venue.status = "PENDING";
            }
        }

        req.venue = venue;
        req.CurrentHost = host;
        next();

    } catch (err) {
        return res.status(500).json({ error: "validation of host venue ownership failed!" });
    }
};
