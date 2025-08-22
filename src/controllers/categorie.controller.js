import { prisma } from '../config/db.js'
import { categorieSchema } from '../schemas/categorie.schema.js'

/* Créer une catégorie */
export const createCategorie = async (c) => {
  const body = await c.req.json()
  const data = categorieSchema.parse(body)

  const categorie = await prisma.categorie.create({ data })
  return c.json(categorie, 201)
}

/* Lister toutes les catégories */
export const getCategories = async (c) => {
  const categories = await prisma.categorie.findMany({
    include: { livres: true } 
  })
  return c.json(categories)
}

/* Récupérer une catégorie par ID */
export const getCategorie = async (c) => {
  const id = Number(c.req.param('id'))
  const categorie = await prisma.categorie.findUnique({
    where: { id },
    include: { livres: true }
  })

  if (!categorie) {
    return c.json({ message: 'Catégorie introuvable' }, 404)
  }

  return c.json(categorie)
}

/* Modifier une catégorie */
export const updateCategorie = async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  const data = categorieSchema.partial().parse(body)

  const categorie = await prisma.categorie.update({
    where: { id },
    data
  })

  return c.json(categorie)
}

/* Supprimer une catégorie */
export const deleteCategorie = async (c) => {
  const id = Number(c.req.param('id'))

  await prisma.categorie.delete({ where: { id } })
  return c.json({ message: 'Catégorie supprimée' })
}
