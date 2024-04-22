-- CreateTable
CREATE TABLE "admin_users" (
    "id" VARCHAR(16) NOT NULL,
    "username" VARCHAR(50),
    "password" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by_id" VARCHAR(16),
    "updated_by_id" VARCHAR(16),
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" VARCHAR(16) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" TEXT NOT NULL,
    "permissions" JSONB[],
    "description" VARCHAR(100),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by_id" VARCHAR(16),
    "updated_by_id" VARCHAR(16),

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users_roles_links" (
    "id" VARCHAR(16) NOT NULL,
    "user_id" VARCHAR(16),
    "role_id" VARCHAR(16),

    CONSTRAINT "admin_users_roles_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "static_pages" (
    "id" VARCHAR(16) NOT NULL,
    "path" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by_id" VARCHAR(16),
    "updated_by_id" VARCHAR(16),

    CONSTRAINT "static_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" VARCHAR(16) NOT NULL,
    "code" VARCHAR(5) NOT NULL,
    "content" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by_id" VARCHAR(16),
    "updated_by_id" VARCHAR(16),

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_code_key" ON "admin_roles"("code");

-- CreateIndex
CREATE INDEX "admin_roles_created_at_idx" ON "admin_roles"("created_at");

-- CreateIndex
CREATE INDEX "admin_roles_updated_at_idx" ON "admin_roles"("updated_at");

-- CreateIndex
CREATE INDEX "admin_roles_updated_by_id_fk" ON "admin_roles"("updated_by_id");

-- CreateIndex
CREATE INDEX "admin_roles_created_by_id_fk" ON "admin_roles"("created_by_id");

-- CreateIndex
CREATE INDEX "admin_users_roles_links_inv_fk" ON "admin_users_roles_links"("role_id");

-- CreateIndex
CREATE INDEX "admin_users_roles_links_fk" ON "admin_users_roles_links"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_roles_links_unique" ON "admin_users_roles_links"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "static_pages_path_key" ON "static_pages"("path");

-- CreateIndex
CREATE INDEX "static_pages_created_by_id_idx" ON "static_pages"("created_by_id");

-- CreateIndex
CREATE INDEX "static_pages_updated_by_id_idx" ON "static_pages"("updated_by_id");

-- CreateIndex
CREATE INDEX "static_pages_created_at_idx" ON "static_pages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE INDEX "languages_created_by_id_idx" ON "languages"("created_by_id");

-- CreateIndex
CREATE INDEX "languages_updated_by_id_idx" ON "languages"("updated_by_id");

-- CreateIndex
CREATE INDEX "languages_created_at_idx" ON "languages"("created_at");

-- AddForeignKey
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users_roles_links" ADD CONSTRAINT "admin_users_roles_links_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_users_roles_links" ADD CONSTRAINT "admin_users_roles_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "static_pages" ADD CONSTRAINT "static_pages_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
