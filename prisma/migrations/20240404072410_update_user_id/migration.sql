-- DropIndex
DROP INDEX "sites_deleted_at_idx";

-- AlterTable
ALTER TABLE "sites" ADD COLUMN     "user_id" VARCHAR(16);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "sites_user_id_idx" ON "sites"("user_id");

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
