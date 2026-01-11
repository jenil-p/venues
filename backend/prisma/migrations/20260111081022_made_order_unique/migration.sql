/*
  Warnings:

  - A unique constraint covering the columns `[venueId,order]` on the table `VenuePhoto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VenuePhoto_venueId_order_key" ON "VenuePhoto"("venueId", "order");
