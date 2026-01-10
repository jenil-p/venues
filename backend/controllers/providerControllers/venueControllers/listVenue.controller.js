import prisma from "../../../prisma/client.js";

export async function listVenue(req, res) {
    try {
        const userId = req.user.id;

        const { venuename, description, capacity, contactemail, contactnumber1, contactnumber2, address } = req.body;

        const provider = await prisma.providerProfile.findUnique({
            where: { userId }
        });

        if (!provider || provider.status !== "APPROVED") {
            return res.status(403).json({ message: "Only approved providers can list venues" });
        }

        if ( !venuename || !capacity || !contactemail || !contactnumber1 || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const { location, postalcode, latitude, longitude, cityId } = address;

        const createdAddress = await prisma.address.create({
            data: {
                location,
                postalcode,
                latitude,
                longitude,
                cityId
            }
        });

        const venue = await prisma.venue.create({
            data: {
                venuename,
                description,
                capacity,
                contactemail,
                contactnumber1,
                contactnumber2,
                providerId: provider.id,
                addressId: createdAddress.id
            }
        });

        return res.status(201).json({ message: "Venue created successfully", venueId: venue.id });

    } catch (err) {
        return res.status(500).json({ message: "Error creating venue", err });
    }
}
