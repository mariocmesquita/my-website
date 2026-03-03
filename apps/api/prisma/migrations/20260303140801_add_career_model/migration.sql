-- CreateTable
CREATE TABLE "careers" (
    "id" UUID NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);
