import prisma from "../../prisma/client.js";

export async function requestHost(req, res) {
  try {
    const userId = req.user.id;
    const { fullname, contact1, contact2, pannumber, idProof, photo } = req.body;

    const existingHost = await prisma.hostMaster.findUnique({
      where: { 
        userId : userId,
       }
    });

    if (existingHost && existingHost.status == "APPROVED") {
      return res.status(409).json({ message: "You are already a host..." });
    }
    
    else if (existingHost && existingHost.status == "PENDING"){
        return res.status(409).json({ message: "Host request already submitted..." });
    }

    else if (existingHost && existingHost.status == "REJECTED"){
        return res.status(409).json({ message: "your request has been rejected ..." })
    }

    if(!contact1 || !fullname){
        return res.status(404).json({ message: "contact/fullname missing" })
    }

    else {
        await prisma.hostMaster.create({
          data: {
            userId,
            fullname,
            contact1,
            contact2,
            pannumber,
            idProof,
            photo,
            status: "PENDING"
          }
        });
    }

    return res.status(201).json({
      message: "Host request submitted successfully"
    });

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}

export async function myRequest(req, res) {
  try {
    const userId = req.user.id;

    const request = await prisma.hostMaster.findUnique({
      where: { userId }
    });

    if (!request) {
      return res.status(404).json({ message: "No host request found" });
    }

    return res.status(200).json(request);

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}
