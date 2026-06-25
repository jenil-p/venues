import prisma from "../../../prisma/client.js";

export async function getVenues(req, res) {
    try {
        const venues = await prisma.venue.findMany({
            select: {
                id: true,
                venuename: true,
                rating: true,
                photos: {
                    select: { image: true },
                    where: { order: 1 }
                },
                pricing: {
                    select: { price: true, unit: true },
                },
                address: {
                    select:{
                        location: true,
                        city: {
                            select:{
                                name: true,
                            }
                        }
                    }
                }
            },
            where: {
                status: "ACTIVE"
            }
        })
        
        return res.status(200).json({ message: "venues fatched successfully.", data: venues })
    } catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
}

export async function getVenue(req, res) {
    const { venueId } = req.params;
    try {
        const venue = await prisma.venue.findUnique({
            where: {
                id: Number(venueId)
            },
            select: {
                id: true,
                venuename: true,
                description: true,
                capacity: true,
                contactemail: true,
                contactnumber1: true,
                rating: true,
                providerId: true,
    
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
                        description: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
    
                pricing: {
                    select: {
                        price: true,
                        unit: true
                    }
                },
    
                reviews: {
                    select: {
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: {
                            select: {
                                fullname: true,
                            }
                        }
                    }
                }
            }
        });
    
        return res.status(200).json({ message: "venue got successfylly.", data: venue });
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
}