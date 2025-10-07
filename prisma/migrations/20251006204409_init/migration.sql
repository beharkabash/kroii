-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."FuelType" AS ENUM ('DIESEL', 'PETROL', 'ELECTRIC', 'HYBRID', 'PLUGIN_HYBRID');

-- CreateEnum
CREATE TYPE "public"."TransmissionType" AS ENUM ('AUTOMATIC', 'MANUAL', 'SEMI_AUTOMATIC');

-- CreateEnum
CREATE TYPE "public"."DriveType" AS ENUM ('FWD', 'RWD', 'AWD', 'FOUR_WD');

-- CreateEnum
CREATE TYPE "public"."CarStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'COMING_SOON', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."CarCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_WORK');

-- CreateEnum
CREATE TYPE "public"."CarCategory" AS ENUM ('PREMIUM', 'FAMILY', 'SUV', 'COMPACT', 'SPORTS', 'LUXURY', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATING', 'CONVERTED', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "public"."LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('EMAIL_SENT', 'PHONE_CALL', 'MEETING', 'NOTE_ADDED', 'STATUS_CHANGED', 'CAR_SHOWN', 'TEST_DRIVE');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'UNSUBSCRIBED', 'BOUNCED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."cars" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "priceEur" INTEGER NOT NULL,
    "fuel" "public"."FuelType" NOT NULL,
    "transmission" "public"."TransmissionType" NOT NULL,
    "kmNumber" INTEGER NOT NULL,
    "color" TEXT,
    "driveType" "public"."DriveType",
    "engineSize" TEXT,
    "power" INTEGER,
    "status" "public"."CarStatus" NOT NULL DEFAULT 'AVAILABLE',
    "condition" "public"."CarCondition" NOT NULL DEFAULT 'GOOD',
    "category" "public"."CarCategory" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "soldAt" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "detailedDescription" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."car_images" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."car_features" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "car_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."car_specifications" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "car_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "leadScore" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'contact_form',
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "public"."LeadPriority" NOT NULL DEFAULT 'MEDIUM',
    "carId" TEXT,
    "assignedToId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_notes" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_activities" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "source" TEXT,
    "preferences" JSONB,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    "lastEmailSent" TIMESTAMP(3),

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."car_views" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."page_views" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "loadTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."web_vitals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "public"."accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "public"."sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "public"."verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "cars_slug_key" ON "public"."cars"("slug");

-- CreateIndex
CREATE INDEX "cars_slug_idx" ON "public"."cars"("slug");

-- CreateIndex
CREATE INDEX "cars_brand_idx" ON "public"."cars"("brand");

-- CreateIndex
CREATE INDEX "cars_status_idx" ON "public"."cars"("status");

-- CreateIndex
CREATE INDEX "cars_category_idx" ON "public"."cars"("category");

-- CreateIndex
CREATE INDEX "cars_featured_idx" ON "public"."cars"("featured");

-- CreateIndex
CREATE INDEX "cars_priceEur_idx" ON "public"."cars"("priceEur");

-- CreateIndex
CREATE INDEX "cars_year_idx" ON "public"."cars"("year");

-- CreateIndex
CREATE INDEX "cars_createdAt_idx" ON "public"."cars"("createdAt");

-- CreateIndex
CREATE INDEX "car_images_carId_idx" ON "public"."car_images"("carId");

-- CreateIndex
CREATE INDEX "car_images_isPrimary_idx" ON "public"."car_images"("isPrimary");

-- CreateIndex
CREATE INDEX "car_features_carId_idx" ON "public"."car_features"("carId");

-- CreateIndex
CREATE INDEX "car_specifications_carId_idx" ON "public"."car_specifications"("carId");

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "public"."contact_submissions"("email");

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "public"."contact_submissions"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_leadScore_idx" ON "public"."contact_submissions"("leadScore");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "public"."contact_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "contact_submissions_carId_idx" ON "public"."contact_submissions"("carId");

-- CreateIndex
CREATE INDEX "contact_notes_contactId_idx" ON "public"."contact_notes"("contactId");

-- CreateIndex
CREATE INDEX "contact_activities_contactId_idx" ON "public"."contact_activities"("contactId");

-- CreateIndex
CREATE INDEX "contact_activities_type_idx" ON "public"."contact_activities"("type");

-- CreateIndex
CREATE INDEX "contact_activities_createdAt_idx" ON "public"."contact_activities"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "public"."newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_email_idx" ON "public"."newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_status_idx" ON "public"."newsletter_subscribers"("status");

-- CreateIndex
CREATE INDEX "car_views_carId_idx" ON "public"."car_views"("carId");

-- CreateIndex
CREATE INDEX "car_views_createdAt_idx" ON "public"."car_views"("createdAt");

-- CreateIndex
CREATE INDEX "page_views_path_idx" ON "public"."page_views"("path");

-- CreateIndex
CREATE INDEX "page_views_createdAt_idx" ON "public"."page_views"("createdAt");

-- CreateIndex
CREATE INDEX "web_vitals_name_idx" ON "public"."web_vitals"("name");

-- CreateIndex
CREATE INDEX "web_vitals_path_idx" ON "public"."web_vitals"("path");

-- CreateIndex
CREATE INDEX "web_vitals_createdAt_idx" ON "public"."web_vitals"("createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "public"."activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_entity_idx" ON "public"."activity_logs"("entity");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "public"."activity_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "public"."system_config"("key");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."car_images" ADD CONSTRAINT "car_images_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."car_features" ADD CONSTRAINT "car_features_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."car_specifications" ADD CONSTRAINT "car_specifications_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_submissions" ADD CONSTRAINT "contact_submissions_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."cars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_submissions" ADD CONSTRAINT "contact_submissions_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_notes" ADD CONSTRAINT "contact_notes_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."contact_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_notes" ADD CONSTRAINT "contact_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_activities" ADD CONSTRAINT "contact_activities_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."contact_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."car_views" ADD CONSTRAINT "car_views_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
