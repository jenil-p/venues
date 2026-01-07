import prisma from "../../prisma/client.js";

export async function approveProvider(req, res, next) {
  try {
    const { id } = req.params;

    const provider = await prisma.providerProfile.findUnique({
      where: { id: Number(id) }
    });

    if (!provider || provider.status == "APPROVED") {
      return res.status(404).json({ message: "Invalid provider request" });
    }

    await prisma.providerProfile.update({
      where: { id: provider.id },
      data: { status: "APPROVED" }
    });

    const role = await prisma.role.findUnique({
      where: {
        rolename: "PROVIDER"
      }
    })

    const isEntry = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: provider.userId,
          roleId: role.id
        }
      }
    })

    if (!isEntry) {
      await prisma.userRole.create({
        data: {
          userId: provider.userId,
          roleId: role.id
        }
      })
    }

    req.objectId = id;

    res.status(200).json({ message: "provider approved successfully" });
    next();

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}

export async function rejectProvider(req, res, next) {
  try {
    const { id } = req.params;

    const provider = await prisma.providerProfile.findUnique({
      where: { id: Number(id) }
    });

    if (!provider || provider.status !== "PENDING") {
      return res.status(404).json({ message: "Invalid provider request" });
    }

    await prisma.providerProfile.update({
      where: { id: provider.id },
      data: { status: "REJECTED" }
    });

    req.objectId = id;

    res.status(200).json({ message: "provider rejected successfully" });
    next();

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}

export async function getAllProvider(req, res, next) {
  try {
    const providers = await prisma.providerProfile.findMany({});

    res.status(200).json({ message: "got all providers", providers });
    next();
  } catch (error) {
    return res.status(400).json({ message: "internal server error: ", error });
  }
}

export async function getProvider(req, res, next) {
  try {
    const { providerId } = req.params;

    const provider = await prisma.providerProfile.findUnique({
      where: {
        id: Number(providerId)
      }
    })

    if (!provider) {
      return res.status(404).json({ message: "provider not found." });
    }

    res.status(200).json({ provider });

    req.objectId = provider.id;

    next();
  } catch (err) {
    return res.status(400).json({ message: "error getting provider", err });
  }
}

export async function deleteProvider(req, res, next) {
  try {
    const { providerId } = req.params;

    const providerExists = await prisma.providerProfile.findUnique({
      where: {
        id: Number(providerId)
      }
    })

    if (!providerExists) {
      return res.status(404).json({ message: "provider not found." });
    }

    const provider = await prisma.providerProfile.update({
      where: {
        id: Number(providerId)
      },
      data: {
        status: "DELETED",
      }
    })

    res.status(200).json({ message: "provider deleted successfully.", provider });

    req.objectId = provider.id;

    next();
  } catch (err) {
    return res.status(400).json({ message: "error deleting provider", err });
  }
}