-- DropForeignKey
ALTER TABLE "SaleItems" DROP CONSTRAINT "SaleItems_productId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItems" DROP CONSTRAINT "SaleItems_saleId_fkey";

-- AddForeignKey
ALTER TABLE "SaleItems" ADD CONSTRAINT "SaleItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItems" ADD CONSTRAINT "SaleItems_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sales"("saleId") ON DELETE CASCADE ON UPDATE CASCADE;
