import prisma from "../../prisma/client.js";

export async function approveService(req, res, next) {
    try {
        const { serviceId } = req.params;

        const service = await prisma.service.findUnique({
            where: {
                id: Number(serviceId),
            }
        })

        if (!service) {
            return res.status(404).json({ message: "service not found" })
        }

        if (service.status === "ACTIVE") {
            return res.status(409).json({ message: "invalid service approval request!" });
        }

        await prisma.service.update({
            where: {
                id: Number(serviceId),
            },
            data: {
                status: "ACTIVE",
            }
        })

        req.objectId = service.id;

        res.status(200).json({ message: "service approved successfully." });
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "error approving service" });
    }
}


export async function rejectService(req, res, next) {
    try {
        const { serviceId } = req.params;

        const service = await prisma.service.findUnique({
            where: {
                id: Number(serviceId),
            }
        })

        if (!service) {
            return res.status(404).json({ message: "service not found" })
        }

        if (service.status === "BLOCKED") {
            return res.status(409).json({ message: "invalid service approval request!" });
        }

        await prisma.service.update({
            where: {
                id: Number(serviceId),
            },
            data: {
                status: "BLOCKED",
            }
        })

        req.objectId = service.id;

        res.status(200).json({ message: "service rejected successfully." });
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "error rejecting service" });
    }
}


export async function getAllServices(req, res, next) {
    try {
        const services = await prisma.service.findMany({
            select: {
                id: true,
                name: true,
                rating: true,
                category: {
                    select: {
                        name: true
                    }
                },
                city: {
                    select: {
                        name: true
                    }
                },
                provider: {
                    select: {
                        legalname: true
                    }
                },
                status: true
            }
        })

        res.status(200).json({ services });
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "error fatching services." });
    }
}


export async function getService(req, res, next) {
    try {
        const { serviceId } = req.params;

        const service = await prisma.service.findUnique({
            where: {
                id: Number(serviceId),
            },
            include: {
                category: true,

                city: {
                    include: {
                        state: {
                            include: {
                                country: true
                            }
                        }
                    }
                },

                provider: {
                    include: {
                        user: true,
                        address: {
                            include: {
                                city: {
                                    include: {
                                        state: {
                                            include: {
                                                country: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });


        if (!service) {
            return res.status(404).json({ message: "service not found." });
        }

        req.objectId = service.id;

        res.status(200).json({ service });
        next();
    } catch (err) {
        return res.status(500).json({ message: "failed getting service" });
    }
}


export async function deleteService(req, res, next) {
    try {
        const { serviceId } = req.params;

        const service = await prisma.service.findUnique({
            where: {
                id: Number(serviceId),
            }
        })

        if (!service) {
            return res.status(404).json({ message: "service not found." });
        }

        if (service.status === "DELETED") {
            return res.status(400).json({ message: "service has already been deleted." });
        }

        await prisma.service.update({
            where: {
                id: Number(serviceId),
            },
            data: {
                status: "DELETED",
            }
        })

        req.objectId = service.id;

        res.status(200).json({ message: "service deleted successfully.", service });
        next();
    } catch (err) {
        return res.status(500).json({ message: "failed deleting service" });
    }
}