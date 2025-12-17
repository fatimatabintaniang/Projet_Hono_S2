-- CreateEnum
CREATE TYPE "public"."Format" AS ENUM ('PDF', 'EPUB', 'DOCS');

-- CreateEnum
CREATE TYPE "public"."TypeLivre" AS ENUM ('LIVRE_COURS', 'MEMOIRE');

-- CreateEnum
CREATE TYPE "public"."StatutMemoire" AS ENUM ('en_attente', 'valide');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'ENSEIGNANT', 'ETUDIANT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL DEFAULT '0000000000',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."Role" NOT NULL DEFAULT 'ETUDIANT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LivreElectronique" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "format" "public"."Format" NOT NULL,
    "chemin_fichier" TEXT NOT NULL,
    "type" "public"."TypeLivre" NOT NULL,
    "categorieId" INTEGER NOT NULL,
    "niveauId" INTEGER NOT NULL,
    "matiereId" INTEGER NOT NULL,

    CONSTRAINT "LivreElectronique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categorie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Niveau" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "Niveau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Matiere" (
    "id" SERIAL NOT NULL,
    "nom_matiere" TEXT NOT NULL,

    CONSTRAINT "Matiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoriqueLecture" (
    "id" SERIAL NOT NULL,
    "date_lecture" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "livreId" INTEGER NOT NULL,

    CONSTRAINT "HistoriqueLecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoriqueTelechargement" (
    "id" SERIAL NOT NULL,
    "date_telechargement" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "livreId" INTEGER NOT NULL,

    CONSTRAINT "HistoriqueTelechargement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Favori" (
    "id" SERIAL NOT NULL,
    "a_lire_plus_tard" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "livreId" INTEGER NOT NULL,

    CONSTRAINT "Favori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Memoire" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "specialite" TEXT NOT NULL,
    "fichier_memoire" TEXT NOT NULL,
    "statut" "public"."StatutMemoire" NOT NULL,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "Memoire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."LivreElectronique" ADD CONSTRAINT "LivreElectronique_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "public"."Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivreElectronique" ADD CONSTRAINT "LivreElectronique_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "public"."Niveau"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivreElectronique" ADD CONSTRAINT "LivreElectronique_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "public"."Matiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriqueLecture" ADD CONSTRAINT "HistoriqueLecture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriqueLecture" ADD CONSTRAINT "HistoriqueLecture_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "public"."LivreElectronique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriqueTelechargement" ADD CONSTRAINT "HistoriqueTelechargement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriqueTelechargement" ADD CONSTRAINT "HistoriqueTelechargement_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "public"."LivreElectronique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favori" ADD CONSTRAINT "Favori_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favori" ADD CONSTRAINT "Favori_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "public"."LivreElectronique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Memoire" ADD CONSTRAINT "Memoire_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
