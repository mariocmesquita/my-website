-- CreateTable
CREATE TABLE "career_translations" (
    "id" UUID NOT NULL,
    "career_id" UUID NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_translations" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "summary" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_translations" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "summary" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_translations" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "position" VARCHAR(50) NOT NULL,
    "description" VARCHAR(130) NOT NULL,
    "bio" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "career_translations_career_id_locale_key" ON "career_translations"("career_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "project_translations_project_id_locale_key" ON "project_translations"("project_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "post_translations_post_id_locale_key" ON "post_translations"("post_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "profile_translations_profile_id_locale_key" ON "profile_translations"("profile_id", "locale");

-- AddForeignKey
ALTER TABLE "career_translations" ADD CONSTRAINT "career_translations_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_translations" ADD CONSTRAINT "post_translations_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_translations" ADD CONSTRAINT "profile_translations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
