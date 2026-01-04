import prisma from "../../prisma/client.js";

export async function requestServiceProvider(req, res) {
  try {
    const userId = req.user.id;
    const { name , contact } = req.body;

    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { 
        userId : userId,
       }
    });

    if (existingProvider && existingProvider.status == "APPROVED") {
      return res.status(409).json({ message: "You are already a provider..." });
    }
    
    else if (existingProvider && existingProvider.status == "PENDING"){
        return res.status(409).json({ message: "provider request already submitted..." });
    }

    else if (existingProvider && existingProvider.status == "REJECTED"){
        return res.status(200).json({ message: "your request has been rejected ..." })
    }

    if(!contact || !name){
        return res.status(404).json({ message: "contact/name missing" })
    }

    else {
        await prisma.serviceProvider.create({
          data: {
            userId,
            name,
            contact,
            status: "PENDING"
          }
        });
    }

    return res.status(201).json({
      message: "Service provider request submitted successfully"
    });

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}

export async function myRequestServicProvider(req, res) {
  try {
    const userId = req.user.id;

    const request = await prisma.serviceProvider.findUnique({
      where: { userId }
    });

    if (!request) {
      return res.status(404).json({ message: "No service provider request found" });
    }

    return res.status(200).json(request);

  } catch (err) {
    return res.status(400).json({ message: "Error occurred", err });
  }
}
