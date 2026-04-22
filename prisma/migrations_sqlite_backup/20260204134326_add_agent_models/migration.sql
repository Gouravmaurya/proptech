/*
  Warnings:

  - You are about to drop the column `capRate` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `roi` on the `Property` table. All the data in the column will be lost.
  - Added the required column `sourceId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "location" TEXT,
    "score" REAL,
    "tier" TEXT,
    "reasons" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "propertyData" TEXT,
    "userId" TEXT,
    "propertyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "verdict" TEXT,
    "score" REAL,
    "financials" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Analysis_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Outreach" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "analysisId" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'email',
    "subject" TEXT,
    "body" TEXT,
    "status" TEXT NOT NULL DEFAULT 'drafted',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Outreach_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiligenceReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "flags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DiligenceReport_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "category" TEXT,
    "status" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "geoLocation" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "sqft" REAL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "yearBuilt" INTEGER,
    "rentEstimate" REAL,
    "financials" TEXT,
    "imageUrl" TEXT,
    "images" TEXT,
    "amenities" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("address", "bathrooms", "bedrooms", "createdAt", "description", "id", "imageUrl", "price", "sqft", "title", "updatedAt", "yearBuilt") SELECT "address", "bathrooms", "bedrooms", "createdAt", "description", "id", "imageUrl", "price", "sqft", "title", "updatedAt", "yearBuilt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE UNIQUE INDEX "Property_sourceId_key" ON "Property"("sourceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
