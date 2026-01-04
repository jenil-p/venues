import prisma from "../../prisma/client.js";

export async function approveServiceP(req, res, next) {
  try {
    const { id } = req.params;

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: Number(id) }
    });

    if (!provider || provider.status !== "PENDING") {
      return res.status(404).json({ message: "Invalid provider request" });
    }

    await prisma.serviceProvider.update({
      where: { id: provider.id },
      data: { status: "APPROVED" }
    });

    const role = await prisma.role.findUnique({
        where:{
            rolename: "SERVICE_PROVIDER"
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

    if(!isEntry){
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

export async function rejectServiceP(req, res, next) {
  try {
    const { id } = req.params;

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: Number(id) }
    });

    if (!provider || provider.status !== "PENDING") {
      return res.status(404).json({ message: "Invalid provider request" });
    }

    await prisma.serviceProvider.update({
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

export async function getAllServiceP(req , res, next) {
  try {
    const providers = await prisma.serviceProvider.findMany({});
 
    res.status(200).json({ message: "got all providers", providers });
    next();
  } catch (error) {
    return res.status(400).json({ message: "internal server error: ", error });
  }
}