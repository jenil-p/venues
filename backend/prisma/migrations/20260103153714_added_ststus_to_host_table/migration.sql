-- CreateEnum
CREATE TYPE "HostRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "HostMaster" ADD COLUMN     "status" "HostRequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ServiceProvider" ADD COLUMN     "status" "HostRequestStatus" NOT NULL DEFAULT 'PENDING';
