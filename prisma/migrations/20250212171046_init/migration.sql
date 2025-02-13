/*
  Warnings:

  - The `amount` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 5.0;
