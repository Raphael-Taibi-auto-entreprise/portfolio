-- Script SQL pour ajouter userId aux tables contacts et quotes
-- Exécutez ce script dans votre base de données PostgreSQL

-- Ajouter la colonne userId à la table contacts
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Ajouter la colonne userId à la table quotes
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Ajouter les contraintes de clé étrangère
ALTER TABLE "contacts" 
  DROP CONSTRAINT IF EXISTS "contacts_userId_fkey";
  
ALTER TABLE "contacts" 
  ADD CONSTRAINT "contacts_userId_fkey" 
  FOREIGN KEY ("userId") 
  REFERENCES "User"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE "quotes" 
  DROP CONSTRAINT IF EXISTS "quotes_userId_fkey";
  
ALTER TABLE "quotes" 
  ADD CONSTRAINT "quotes_userId_fkey" 
  FOREIGN KEY ("userId") 
  REFERENCES "User"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- Régénérer le client Prisma après avoir exécuté ce script
-- Exécuter: npx prisma generate
