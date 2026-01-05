/*
  Warnings:

  - The `status` column on the `HostMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `ServiceProvider` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'TEMPORARILY_UNAVAILABLE', 'PENDING', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "HostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DELETED');

-- AlterTable
ALTER TABLE "HostMaster" DROP COLUMN "status",
ADD COLUMN     "status" "HostStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "status" "ServiceStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ServiceProvider" DROP COLUMN "status",
ADD COLUMN     "status" "HostStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "HostRequestStatus";
