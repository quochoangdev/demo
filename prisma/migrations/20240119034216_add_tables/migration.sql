-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'DELETED', 'INACTIVE');

-- CreateTable
CREATE TABLE "sites" (
    "id" VARCHAR(16) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites_tracking" (
    "id" VARCHAR(16) NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "hostname" VARCHAR(256) NOT NULL,
    "ip" VARCHAR(256) NOT NULL,
    "user_agent" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" VARCHAR(16) NOT NULL,
    "site_id" VARCHAR(16) NOT NULL,

    CONSTRAINT "sites_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sites_created_at_idx" ON "sites"("created_at");

-- CreateIndex
CREATE INDEX "sites_deleted_at_idx" ON "sites"("deleted_at");

-- CreateIndex
CREATE INDEX "sites_tracking_date_idx" ON "sites_tracking"("date");

-- CreateIndex
CREATE INDEX "sites_tracking_created_at_idx" ON "sites_tracking"("created_at");

-- CreateIndex
CREATE INDEX "sites_tracking_user_id_idx" ON "sites_tracking"("user_id");

-- AddForeignKey
ALTER TABLE "sites_tracking" ADD CONSTRAINT "sites_tracking_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites_tracking" ADD CONSTRAINT "sites_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
