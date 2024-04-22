/*
  Warnings:

  - The primary key for the `sites_tracking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `sites_tracking` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `sites_tracking` table. All the data in the column will be lost.
  - The `id` column on the `sites_tracking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `original_url` on the `sites_tracking` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- DropIndex
DROP INDEX "sites_tracking_date_idx";

-- AlterTable
ALTER TABLE "sites_tracking" DROP CONSTRAINT "sites_tracking_pkey",
DROP COLUMN "date",
DROP COLUMN "ip",
ADD COLUMN     "city" VARCHAR(256),
ADD COLUMN     "country" VARCHAR(256),
ADD COLUMN     "ip_address" VARCHAR(256),
ADD COLUMN     "region" VARCHAR(256),
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "hostname" DROP NOT NULL,
ALTER COLUMN "user_agent" DROP NOT NULL,
ALTER COLUMN "original_url" DROP NOT NULL,
ALTER COLUMN "original_url" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "site_id" DROP NOT NULL,
ADD CONSTRAINT "sites_tracking_pkey" PRIMARY KEY ("id");
