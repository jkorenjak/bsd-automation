/*
  Warnings:

  - You are about to drop the column `assetId` on the `Balance` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,assetType]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetType` to the `Balance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "Balance_address_key";

-- DropIndex
DROP INDEX "Balance_assetId_address_key";

-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "assetId",
ADD COLUMN     "assetType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "assetId",
DROP COLUMN "userId",
ADD COLUMN     "balanceId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL;

-- DropTable
DROP TABLE "Asset";

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_assetType_key" ON "Balance"("userId", "assetType");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "Balance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
