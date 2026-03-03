-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "position" VARCHAR(50) NOT NULL,
    "description" VARCHAR(130) NOT NULL,
    "bio" VARCHAR(1000) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "socialLinks" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
