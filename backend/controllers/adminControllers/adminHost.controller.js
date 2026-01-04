import prisma from "../../prisma/client.js";

export async function approveHost(req, res, next) {
  try {
    const { id } = req.params;

    const host = await prisma.hostMaster.findUnique({
      where: { id: Number(id) }
    });

    if (!host || host.status !== "PENDING") {
      return res.status(404).json({ message: "Invalid host request" });
    }

    await prisma.hostMaster.update({
      where: { id: host.id },
      data: { status: "APPROVED" }
    });

    const role = await prisma.role.findUnique({
        where:{
            rolename: "VENUE_HOST"
        }
    })

    const isEntry = await prisma.userRole.findUnique({
        where: {
            userId_roleId: {
                userId: host.userId,
                roleId: role.id 
            }
        }
    })

    if(!isEntry){
        await prisma.userRole.create({
            data: {
                userId: host.userId,
                roleId: role.id 
            }
        })
    }

    req.objectId = id;

    res.status(200).json({ message: "Host approved successfully" });
    next();

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}

export async function rejectHost(req, res, next) {
  try {
    const { id } = req.params;

    const host = await prisma.hostMaster.findUnique({
      where: { id: Number(id) }
    });

    if (!host || host.status !== "PENDING") {
      return res.status(404).json({ message: "Invalid host request" });
    }

    await prisma.hostMaster.update({
      where: { id: host.id },
      data: { status: "REJECTED" }
    });

    req.objectId = id;

    res.status(200).json({ message: "Host rejected successfully" });
    next();

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}

export async function getAllHost(req , res, next) {
  try {
    const hosts = await prisma.hostMaster.findMany({});
 
    res.status(200).json({ message: "got all hosts", hosts });
    next();
  } catch (error) {
    return res.status(400).json({ message: "internal server error: ", error });
  }
}