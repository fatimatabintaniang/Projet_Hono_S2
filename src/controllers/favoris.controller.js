import { prisma } from '../config/db.js'
import { favoriSchema } from '../schemas/favoris.schema.js'
// Ajouter un favori
export const addFavori = async (c) => {
  const body = await c.req.json()
    const data = favoriSchema.parse(body)
    const favori = await prisma.favori.create({data})
    return c.json(favori,201)
}

// recupérer tous les favoris
export const getFavoris = async (c) => {
    const favoris = await prisma.favori.findMany({
        include: { livre: true }
    })
    return c.json(favoris)
}

// Récupérer les favoris d'un utilisateur
export const getFavorisByUser = async (c) => {
  const userId = Number(c.req.param('userId'))  
    const favoris = await prisma.favori.findMany({
        where: { userId },
        include: { livre: true }
    })
    return c.json(favoris)
}
// Supprimer un favori
export const deleteFavori = async (c) => {
    const id = Number(c.req.param('id'))
    await prisma.favori.delete({ where: { id } })
    return c.json({ message: 'Favori supprimé' })
}
// Mettre à jour un favori
export const updateFavori = async (c) => {
    const id = Number(c.req.param('id'))
    const data = await c.req.json()

    const favori = await prisma.favori.update({
        where: { id },
        data
    })
    return c.json(favori)
}