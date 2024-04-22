-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(16) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(256) NOT NULL DEFAULT '',
    "locale" TEXT DEFAULT 'us',
    "picture" VARCHAR(1024),
    "email_verified" BOOLEAN DEFAULT false,
    "iss" VARCHAR(1024),
    "aud" VARCHAR(1024),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
