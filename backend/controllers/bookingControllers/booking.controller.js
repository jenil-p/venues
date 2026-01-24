import prisma from "../../prisma/client.js";

export async function makeBooking(req , res) {
    try {
        const { venueId } = req.params;
        const userId  = req.user.id;

        console.log(userId)

        const { noOfGuest, startTime, endTime } = req.body;

        if(!noOfGuest || !startTime || !endTime){
            return res.status(400).json({ message: "Fields are missing" });
        }

        const existingBookingsAtTime = await prisma.booking.findMany({
            where: {
                venueId: Number(venueId),
                startTime: {
                    gte: new Date(endTime),
                },
                endTime: {
                    lte: new Date(startTime),
                },
                bookingStatus: "CONFIRMED", // here i have to think. At this point.
            }
        })

        if(existingBookingsAtTime.length > 0){
            return res.status(404).json({ message: "OOPS! this slot is already booked for this venue!" });
        }

        const booking = await prisma.booking.create({
            data: {
                venueId: Number(venueId),
                userId: userId,
                startTime: startTime,
                endTime: endTime,
                numberOfGuestsExpected: noOfGuest,
                totalCost: 53000,
            }
        })

        return res.status(200).json({ booking });
        
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
}