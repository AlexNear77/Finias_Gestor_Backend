-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "branchId" TEXT;

-- CreateTable
CREATE TABLE "Branches" (
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Branches_pkey" PRIMARY KEY ("branchId")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branches"("branchId") ON DELETE CASCADE ON UPDATE CASCADE;
