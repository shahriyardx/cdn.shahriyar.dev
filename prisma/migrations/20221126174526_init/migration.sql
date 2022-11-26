-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "folder" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");
