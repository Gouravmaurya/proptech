-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "agentEmail" TEXT,
ADD COLUMN     "agentLicense" TEXT,
ADD COLUMN     "agentName" TEXT,
ADD COLUMN     "agentPhone" TEXT,
ADD COLUMN     "brokerName" TEXT,
ADD COLUMN     "brokerPhone" TEXT,
ADD COLUMN     "mlsId" TEXT,
ADD COLUMN     "mlsName" TEXT;

-- CreateTable
CREATE TABLE "SavedProperty" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedProperty_userId_propertyId_key" ON "SavedProperty"("userId", "propertyId");

-- AddForeignKey
ALTER TABLE "SavedProperty" ADD CONSTRAINT "SavedProperty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProperty" ADD CONSTRAINT "SavedProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
