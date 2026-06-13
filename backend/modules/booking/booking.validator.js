import { z } from 'zod';

export const makeBookingSchema = z.object({
    body: z.object({
        noOfGuest: z
            .number({ required_error: "Number of guests is required" })
            .int("Number of guests must be a whole number")
            .min(1, "At least 1 guest is required"),

        startTime: z
            .string({ required_error: "Start time is required" })
            .datetime({ message: "startTime must be a valid ISO 8601 datetime" })
            .refine(val => new Date(val) > new Date(), {
                message: "Start time must be in the future",
            }),

        endTime: z
            .string({ required_error: "End time is required" })
            .datetime({ message: "endTime must be a valid ISO 8601 datetime" }),
    })
    .refine(data => new Date(data.endTime) > new Date(data.startTime), {
        message: "End time must be after start time",
        path: ["endTime"],
    }),

    params: z.object({
        venueId: z
            .string()
            .regex(/^\d+$/, "venueId must be a numeric string")
            .transform(Number),
    }),
});