-- AlterTable
ALTER TABLE "sites" ADD COLUMN     "point" INTEGER DEFAULT 1,
ADD COLUMN     "time" INTEGER DEFAULT 15,
ADD COLUMN     "view" INTEGER DEFAULT 10;