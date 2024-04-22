/*
  Warnings:

  - You are about to drop the column `city` on the `sites_tracking` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `sites_tracking` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `sites_tracking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sites_tracking" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "region",
ADD COLUMN     "completed" BOOLEAN DEFAULT false,
ADD COLUMN     "forward_ip" VARCHAR(256),
ADD COLUMN     "real_ip" VARCHAR(256);
