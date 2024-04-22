/*
  Warnings:

  - The primary key for the `admin_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_by_id` on the `admin_roles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `admin_roles` table. All the data in the column will be lost.
  - The primary key for the `admin_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_by_id` on the `admin_users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `admin_users` table. All the data in the column will be lost.
  - The primary key for the `admin_users_roles_links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `languages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_by_id` on the `languages` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `languages` table. All the data in the column will be lost.
  - The primary key for the `sites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sites_tracking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `static_pages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_by_id` on the `static_pages` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `static_pages` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "admin_roles" DROP CONSTRAINT "admin_roles_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_roles" DROP CONSTRAINT "admin_roles_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_users_roles_links" DROP CONSTRAINT "admin_users_roles_links_role_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_users_roles_links" DROP CONSTRAINT "admin_users_roles_links_user_id_fkey";

-- DropForeignKey
ALTER TABLE "languages" DROP CONSTRAINT "languages_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "languages" DROP CONSTRAINT "languages_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "sites" DROP CONSTRAINT "sites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sites_tracking" DROP CONSTRAINT "sites_tracking_site_id_fkey";

-- DropForeignKey
ALTER TABLE "sites_tracking" DROP CONSTRAINT "sites_tracking_user_id_fkey";

-- DropForeignKey
ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_updated_by_id_fkey";

-- DropIndex
DROP INDEX "admin_roles_created_by_id_fk";

-- DropIndex
DROP INDEX "admin_roles_updated_by_id_fk";

-- DropIndex
DROP INDEX "languages_created_by_id_idx";

-- DropIndex
DROP INDEX "languages_updated_by_id_idx";

-- DropIndex
DROP INDEX "static_pages_created_by_id_idx";

-- DropIndex
DROP INDEX "static_pages_updated_by_id_idx";

-- AlterTable
ALTER TABLE "admin_roles" DROP CONSTRAINT "admin_roles_pkey",
DROP COLUMN "created_by_id",
DROP COLUMN "updated_by_id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_by" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_pkey",
DROP COLUMN "created_by_id",
DROP COLUMN "updated_by_id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_by" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "admin_users_roles_links" DROP CONSTRAINT "admin_users_roles_links_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "role_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "admin_users_roles_links_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "languages" DROP CONSTRAINT "languages_pkey",
DROP COLUMN "created_by_id",
DROP COLUMN "updated_by_id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sites" DROP CONSTRAINT "sites_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sites_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sites_tracking" DROP CONSTRAINT "sites_tracking_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "site_id" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sites_tracking_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sites_tracking_id_seq";

-- AlterTable
ALTER TABLE "static_pages" DROP CONSTRAINT "static_pages_pkey",
DROP COLUMN "created_by_id",
DROP COLUMN "updated_by_id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "static_pages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites_tracking" ADD CONSTRAINT "sites_tracking_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites_tracking" ADD CONSTRAINT "sites_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_users_roles_links" ADD CONSTRAINT "admin_users_roles_links_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users_roles_links" ADD CONSTRAINT "admin_users_roles_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
