/*
  Warnings:

  - You are about to drop the column `contact` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Subscription_email_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "contact",
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "amount" SET DEFAULT '5.0',
ALTER COLUMN "amount" SET DATA TYPE TEXT;
