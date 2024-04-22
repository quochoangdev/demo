-- DropForeignKey
ALTER TABLE "admin_users_roles_links" DROP CONSTRAINT "admin_users_roles_links_role_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_users_roles_links" DROP CONSTRAINT "admin_users_roles_links_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sites" DROP CONSTRAINT "sites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sites_tracking" DROP CONSTRAINT "sites_tracking_site_id_fkey";

-- DropForeignKey
ALTER TABLE "sites_tracking" DROP CONSTRAINT "sites_tracking_user_id_fkey";

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
