/*
  Warnings:

  - You are about to alter the column `amount` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "amount" SET DEFAULT 5,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;
