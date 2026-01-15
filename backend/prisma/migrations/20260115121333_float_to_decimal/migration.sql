/*
  Warnings:

  - You are about to alter the column `totalCost` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `priceAtBooking` on the `BookingService` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `basePrice` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `revenue` on the `ServiceStatistic` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `rating` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `price` on the `VenuePricingRule` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `revenue` on the `VenueStatistic` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "totalCost" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "BookingService" ALTER COLUMN "priceAtBooking" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "basePrice" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "ServiceStatistic" ALTER COLUMN "revenue" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Venue" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "VenuePricingRule" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "VenueStatistic" ALTER COLUMN "revenue" SET DATA TYPE DECIMAL(65,30);
