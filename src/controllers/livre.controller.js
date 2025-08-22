import { prisma } from '../config/db.js'

// Créer un livre
export const createLivre = async (c) => {
  const data = await c.req.json()

  const livre = await prisma.livreElectronique.create({
    data: {
      titre: data.titre,
      auteur: data.auteur,
      format: data.format,
      chemin_fichier: data.chemin_fichier,
      type: data.type,
      categorieId: data.categorieId,
      niveauId: data.niveauId,
      matiereId: data.matiereId
    }
  })

  return c.json(livre)
}

// Récupérer tous les livres
export const getLivres = async (c) => {
  const livres = await prisma.livreElectronique.findMany({
    include: { categorie: true, niveau: true, matiere: true }
  })
  return c.json(livres)
}

// Récupérer un livre par ID
export const getLivre = async (c) => {
  const id = Number(c.req.param('id'))
  const livre = await prisma.livreElectronique.findUnique({
    where: { id },
    include: { categorie: true, niveau: true, matiere: true }
  })
  if (!livre) return c.json({ error: 'Livre non trouvé' }, 404)
  return c.json(livre)
}

// Mettre à jour un livre
export const updateLivre = async (c) => {
  const id = Number(c.req.param('id'))
  const data = await c.req.json()

  const livre = await prisma.livreElectronique.update({
    where: { id },
    data
  })

  return c.json(livre)
}

// Supprimer un livre
export const deleteLivre = async (c) => {
  const id = Number(c.req.param('id'))
  await prisma.livreElectronique.delete({ where: { id } })
  return c.json({ message: 'Livre supprimé' })
}
