-- Northline initial tenant schema. Apply with: npx prisma migrate deploy

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'OWNER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Merchant" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Store" (
  "id" TEXT PRIMARY KEY,
  "merchantId" TEXT NOT NULL REFERENCES "Merchant"("id"),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Store_merchantId_idx" ON "Store"("merchantId");

CREATE TABLE "StoreMember" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "storeId" TEXT NOT NULL REFERENCES "Store"("id"),
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "storeId")
);

CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "storeId" TEXT NOT NULL REFERENCES "Store"("id"),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "priceCents" INTEGER NOT NULL,
  "sku" TEXT,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE ("storeId", "sku")
);
CREATE INDEX "Product_storeId_status_idx" ON "Product"("storeId", "status");

CREATE TABLE "Inventory" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL UNIQUE REFERENCES "Product"("id"),
  "storeId" TEXT NOT NULL,
  "available" INTEGER NOT NULL DEFAULT 0,
  "lowAt" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Customer" (
  "id" TEXT PRIMARY KEY,
  "storeId" TEXT NOT NULL REFERENCES "Store"("id"),
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("storeId", "email")
);

CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY,
  "storeId" TEXT NOT NULL REFERENCES "Store"("id"),
  "customerId" TEXT REFERENCES "Customer"("id"),
  "number" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "totalCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE ("storeId", "number")
);

CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id"),
  "productId" TEXT REFERENCES "Product"("id"),
  "storeId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "priceCents" INTEGER NOT NULL
);

CREATE TABLE "Payment" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"("id"),
  "storeId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Refund" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id"),
  "storeId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Shipment" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"("id"),
  "storeId" TEXT NOT NULL,
  "carrier" TEXT NOT NULL DEFAULT '',
  "tracking" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "storeId" TEXT NOT NULL UNIQUE REFERENCES "Store"("id"),
  "plan" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "StoreSettings" (
  "id" TEXT PRIMARY KEY,
  "storeId" TEXT NOT NULL UNIQUE REFERENCES "Store"("id"),
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "paused" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "storeId" TEXT REFERENCES "Store"("id"),
  "userId" TEXT REFERENCES "User"("id"),
  "action" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_storeId_createdAt_idx" ON "AuditLog"("storeId", "createdAt");
