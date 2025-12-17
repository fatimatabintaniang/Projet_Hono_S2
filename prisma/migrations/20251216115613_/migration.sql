/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Categorie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom_matiere]` on the table `Matiere` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[libelle]` on the table `Niveau` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Categorie_nom_key" ON "public"."Categorie"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Matiere_nom_matiere_key" ON "public"."Matiere"("nom_matiere");

-- CreateIndex
CREATE UNIQUE INDEX "Niveau_libelle_key" ON "public"."Niveau"("libelle");
