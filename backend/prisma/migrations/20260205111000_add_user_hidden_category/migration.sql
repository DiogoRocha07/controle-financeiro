-- CreateTable
CREATE TABLE "UserHiddenCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "UserHiddenCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserHiddenCategory_userId_categoryId_key" ON "UserHiddenCategory"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "UserHiddenCategory" ADD CONSTRAINT "UserHiddenCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHiddenCategory" ADD CONSTRAINT "UserHiddenCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
