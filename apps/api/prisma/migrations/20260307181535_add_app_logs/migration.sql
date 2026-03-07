-- CreateTable
CREATE TABLE "app_logs" (
    "id" UUID NOT NULL,
    "level" VARCHAR(20) NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "message" TEXT NOT NULL,
    "ip" VARCHAR(100),
    "method" VARCHAR(10),
    "path" VARCHAR(500),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_logs_pkey" PRIMARY KEY ("id")
);
