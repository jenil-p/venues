import prisma from "../../prisma/client.js";

export async function requestProvider(req, res) {
  try {
    const userId = req.user.id;

    const { legalname, contact1, contact2, dateOfBirth, idProof, photo, address } = req.body;

    if (!legalname || !contact1 || !dateOfBirth || !idProof || !address) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const madeAddress = await prisma.address.create({
      data:{
        latitude: 0.00,
        longitude: 0.00,
        location: address.location,
        postalcode: Number(address.postalcode),
        cityId: Number(address.cityId),
      }
    })

    const existingProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });

    if (existingProfile && existingProfile.status === "APPROVED") {
      console.log("You are already a verified provider")
      return res.status(409).json({ message: "You are already a verified provider" });
    }

    if (existingProfile && existingProfile.status === "PENDING") {
      console.log("Provider request already submitted")
      return res.status(409).json({ message: "Provider request already submitted" });
    }

    if (existingProfile && existingProfile.status === "REJECTED") {
      await prisma.providerProfile.update({
        where: { userId },
        data: {
          legalname,
          contact1,
          contact2,
          dateOfBirth: new Date(dateOfBirth),
          idProof,
          photo,
          addressId: madeAddress.id,
          status: "PENDING"
        }
      });

      return res.status(200).json({
        message: "Provider request re-submitted for review"
      });
    }

    await prisma.providerProfile.create({
      data: {
        userId,
        legalname,
        contact1,
        contact2,
        dateOfBirth: new Date(dateOfBirth),
        idProof,
        photo,
        addressId: madeAddress.id,
        status: "PENDING"
      }
    });

    return res.status(201).json({
      message: "Provider request submitted successfully"
    });

  } catch (err) {
    return res.status(500).json({ message: "Error occurred", error: err.message });
  }
}

export async function myProviderProfile(req, res) {
  try {
    const userId = req.user.id;

    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        address: true
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "No provider request found" });
    }

    return res.status(200).json(profile);

  } catch (err) {
    return res.status(500).json({ message: "Error occurred", error: err.message });
  }
}
