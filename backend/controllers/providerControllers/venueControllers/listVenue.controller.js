import prisma from "../../../prisma/client.js";

export async function createFullVenue(req, res) {
    try {
        const userId = req.user.id;
        const {
            venuename, description, capacity, contactemail, contactnumber1, contactnumber2,
            address,
            typeId,
            featureIds,
            photos,
            pricing
        } = req.body;

        const provider = await prisma.providerProfile.findUnique({
            where: { userId }
        });

        if (!provider || provider.status !== "APPROVED") {
            return res.status(403).json({ message: "Only approved providers can list venues" });
        }

        if (!venuename || !capacity || !contactemail || !contactnumber1 || !address || !typeId || !featureIds || !photos || photos.length < 5 || !pricing) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const venue = await prisma.venue.create({
            data: {
                venuename,
                description,
                capacity: Number(capacity),
                contactemail,
                contactnumber1,
                contactnumber2,
                status: "PENDING",

                provider: {
                    connect: { id: provider.id }
                },

                address: {
                    create: {
                        location: address.location,
                        postalcode: Number(address.postalcode),
                        latitude: parseFloat(address.latitude),
                        longitude: parseFloat(address.longitude),
                        city: {
                            connect: { id: address.cityId }
                        }
                    }
                },

                types: {
                    create: [
                        {
                            type: { connect: { id: Number(typeId) } }
                        }
                    ]
                },

                features: {
                    create: featureIds.map(fid => ({
                        feature: { connect: { id: Number(fid) } }
                    }))
                },

                photos: {
                    create: photos.map(photo => ({
                        image: photo.image,
                        description: photo.description,
                        order: Number(photo.order)
                    }))
                },

                pricing: {
                    create: pricing.map(p => ({
                        unit: p.unit,
                        price: p.price,
                        startTime: p.startTime ? new Date(p.startTime) : null,
                        endTime: p.endTime ? new Date(p.endTime) : null
                    }))
                }
            },
            include: {
                address: {
                    include: { city: true }
                },
                types: {
                    include: { type: true }
                },
                features: {
                    include: { feature: true }
                },
                photos: {
                    orderBy: { order: 'asc' }
                },
                pricing: true
            }
        });

        return res.status(201).json({ message: "Venue created successfully", venue });

    } catch (err) {
        console.error("Create Venue Error:", err);
        return res.status(500).json({ message: "Error creating venue", error: err.message });
    }
}