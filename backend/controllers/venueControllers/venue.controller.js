import prisma from "../../prisma/client.js";

export async function updateVenue(req, res) {
  const { venueId } = req.params;

  await prisma.venue.update({
    where: { id: Number(venueId) },
    data: req.body
  });

  res.json({ message: "Venue updated" });
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


  res.json({ message: "Venue type set" });
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

  res.json({ message: "Features updated" });
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

  res.json({ message: "Photos added" });
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

  res.json({ message: "Photos reordered" });
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


  res.json({ message: "Pricing updated" });
}

export async function submitVenue(req, res) {
  const { venueId } = req.params;

  await prisma.venue.update({
    where: { id: Number(venueId) },
    data: { status: "PENDING" }
  });

  res.json({ message: "Venue submitted for review" });
}
