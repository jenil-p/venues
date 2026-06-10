/*
  Warnings:

  - Added the required column `pricePerUnit` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "pricePerUnit" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_venueId_idx" ON "Booking"("venueId");

-- CreateIndex
CREATE INDEX "Booking_venueId_startTime_idx" ON "Booking"("venueId", "startTime");

-- CreateIndex
CREATE INDEX "Booking_venueId_startTime_endTime_idx" ON "Booking"("venueId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");
