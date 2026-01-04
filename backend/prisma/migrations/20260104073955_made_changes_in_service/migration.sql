/*
  Warnings:

  - Made the column `contact` on table `ServiceProvider` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `ServiceProvider` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ServiceProvider" DROP CONSTRAINT "ServiceProvider_userId_fkey";

-- AlterTable
ALTER TABLE "ServiceProvider" ALTER COLUMN "contact" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
