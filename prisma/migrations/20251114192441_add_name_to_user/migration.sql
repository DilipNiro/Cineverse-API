-- AlterTable
-- Ajout de la colonne name avec une valeur par défaut pour les utilisateurs existants
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- Mise à jour des utilisateurs existants avec une valeur par défaut
UPDATE "User" SET "name" = 'Utilisateur' WHERE "name" IS NULL;

-- Rendre la colonne NOT NULL maintenant que toutes les valeurs sont définies
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
