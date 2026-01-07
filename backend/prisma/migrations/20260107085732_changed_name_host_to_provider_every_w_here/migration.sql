/*
  Warnings:

  - You are about to drop the column `hostId` on the `Venue` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_hostId_fkey";

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "hostId",
ADD COLUMN     "providerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
