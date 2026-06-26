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

export async function updateVenue(req, res) {
  const { venueId } = req.params;

  await prisma.venue.update({
    where: { id: Number(venueId) },
    data: req.body
  });

  return res.json({ message: "Venue updated" });
}

export async function setVenueType(req, res) {
  const { venueId } = req.params;
  const { typeId } = req.body;


  await prisma.$transaction([
    prisma.venueType.deleteMany({
      where: { venueId: Number(venueId) }
    }),
    prisma.venueType.create({
      data: {
        venueId: Number(venueId),
        typeId
      }
    })
  ]);


  return res.json({ message: "Venue type set" });
}

export async function setVenueFeatures(req, res) {
  const { venueId } = req.params;
  const { featureIds } = req.body; // [ featureId ]

  await prisma.$transaction([
    prisma.venueFeature.deleteMany({
      where: { venueId: Number(venueId) }
    }),
    prisma.venueFeature.createMany({
      data: featureIds.map(id => ({
        venueId: Number(venueId),
        featureId: id
      }))
    })
  ])

  return res.json({ message: "Features updated" });
}

export async function addVenuePhotos(req, res) {
  const { venueId } = req.params;
  const photos = req.body.photos; // [{ image, description, order }]

  await prisma.venuePhoto.createMany({
    data: photos.map(p => ({
      ...p,
      venueId: Number(venueId)
    }))
  });

  return res.json({ message: "Photos added" });
}

export async function reorderPhotos(req, res) {
  const updates = req.body.order; // [{ photoId, order }]

  await prisma.$transaction(
    updates.map(p =>
      prisma.venuePhoto.update({
        where: { id: p.photoId },
        data: { order: p.order }
      })
    )
  );

  return res.json({ message: "Photos reordered" });
}

export async function setPricing(req, res) {
  const { venueId } = req.params;
  const pricing = req.body;  // [{ unit, price }] 

  await prisma.$transaction([
    prisma.venuePricingRule.deleteMany({
      where: { venueId: Number(venueId) }
    }),
    prisma.venuePricingRule.createMany({
      data: pricing.map(p => ({
        ...p,
        venueId: Number(venueId)
      }))
    })
  ])


  return res.json({ message: "Pricing updated" });
}

export async function getVenue(req, res) {
  try {
    const { venueId } = req.params;

    const venue = await prisma.venue.findUnique({
      where: {
        id: Number(venueId)
      },
      include: {
        address: {
          include: {
            city: true
          }
        },
        features: {
          include: {
            feature: true
          }
        },
        types: {
          include: {
            type: true
          }
        },
        photos: {
          orderBy: {
            order: 'asc'
          }
        },
        pricing: true,
        provider: true,
      }
    });

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    return res.status(200).json({ venue });

  } catch (err) {
    console.error("Get Venue Error:", err);
    return res.status(500).json({ message: "Error fetching venue details", error: err.message });
  }
}

export async function getAllVenues(req, res) {
  try {
    const user = req.user;
    const provider = await prisma.providerProfile.findUnique({
      where: {
        userId: user.id
      }
    })
    const venues = await prisma.venue.findMany({
      where: {
        providerId: provider.id,
      },
      select: {
        id: true,
        status: true,
        capacity: true,
        address: {
          select: {
            location: true,
            city: {
              select: {
                name: true
              }
            }
          }
        },
        photos: {
          where: {
            order: 1
          },
          select: {
            image: true,
          }
        }
      }
    })

    return res.status(200).json({ venues })
  } catch (err) {
    console.error("Get Venues Error:", err);
    return res.status(500).json({ message: "Error fetching venues", error: err.message });
  }
}

export async function deleteVenue(req, res) {
  try {
    const { venueId } = req.params;

    const deletedVenue = await prisma.venue.update({
      where: {
        id: Number(venueId)
      },
      data: {
        status: "DELETED",
      }
    })

    return res.status(200).json({ isdeleted: true });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", isdeleted: false });
  }
}

export async function deletePhoto(req, res) {
  try {
    const { venueId, photoId } = req.params;
    const photos = await prisma.venuePhoto.findMany({
      where: {
        venueId: Number(venueId)
      }
    })
    if(photos.length < 6){
      return res.status(400).json({ message: "Venue must have atleast 5 photos" });
    }
    await prisma.venuePhoto.delete({
      where: {
        id: Number(photoId)
      }
    })
    return res.status(200).json({ message: "Sucess" })
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
}