import prisma from "../../../prisma/client.js";

export async function approveVenue(req, res, next) {
    try {
        const { venueId } = req.params;

        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId),
            }
        })

        if (!venue) {
            return res.status(404).json({ message: "venue not found" })
        }

        if (venue.status === "ACTIVE") {
            return res.status(409).json({ message: "invalid venue approval request!" });
        }

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
        return res.status(500).json({ message: "error approving venue" });
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

        if (!venue) {
            return res.status(404).json({ message: "venue not found" })
        }

        if (venue.status === "BLOCKED") {
            return res.status(409).json({ message: "invalid venue approval request!" });
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
        return res.status(500).json({ message: "error rejecting venue" });
    }
}


export async function getAllVenues(req, res, next) {
    try {
        const venues = await prisma.venue.findMany({
            include: {
                address: {
                    select: {
                        location: true,
                        postalcode: true,
                        city: {
                            select: {
                                name: true,
                                state: {
                                    select: {
                                        name: true,
                                        country: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        res.status(200).json({ venues });
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "error fatching venues." });
    }
}


export async function getVenue(req, res, next) {
    try {
        const { venueId } = req.params;

        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId),
            },
            select: {
                id: true,
                venuename: true,
                description: true,
                capacity: true,
                contactemail: true,
                contactnumber1: true,
                contactnumber2: true,
                rating: true,
                status: true,

                address: {
                    select: {
                        location: true,
                        postalcode: true,
                        latitude: true,
                        longitude: true,
                        city: {
                            select: {
                                name: true,
                                state: {
                                    select: {
                                        name: true,
                                        country: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                provider: {
                    select: {
                        id: true,
                        legalname: true,
                        contact1: true,
                        contact2: true,
                        status: true,
                        user: {
                            select: {
                                fullname: true,
                                email: true,
                                contactnumber: true
                            }
                        }
                    }
                },

                features: {
                    select: {
                        feature: {
                            select: {
                                name: true,
                                icon: true
                            }
                        }
                    }
                },

                types: {
                    select: {
                        type: {
                            select: {
                                name: true,
                                icon: true
                            }
                        }
                    }
                },

                photos: {
                    select: {
                        image: true,
                        description: true,
                        order: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },

                pricing: {
                    select: {
                        unit: true,
                        price: true,
                        startTime: true,
                        endTime: true
                    }
                },

                reviews: {
                    select: {
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: {
                            select: {
                                fullname: true
                            }
                        }
                    }
                }
            }
        });

        if (!venue) {
            return res.status(400).json({ message: "venue not found." });
        }

        req.objectId = venue.id;

        res.status(200).json({ venue });
        next();
    } catch (err) {
        return res.status(500).json({ message: "failed getting venue" });
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

        if (!venue) {
            return res.status(400).json({ message: "venue not found." });
        }

        if (venue.status === "DELETED") {
            return res.status(400).json({ message: "venue has already been deleted." });
        }

        await prisma.venue.update({
            where: {
                id: Number(venueId),
            },
            data: {
                status: "DELETED",
            }
        })

        req.objectId = venue.id;

        res.status(200).json({ message: "venue deleted successfully.", venue });
        next();
    } catch (err) {
        return res.status(500).json({ message: "failed deleting venue" });
    }
}