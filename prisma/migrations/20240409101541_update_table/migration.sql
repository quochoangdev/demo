-- AlterTable
ALTER TABLE "sites" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_by" TEXT;
