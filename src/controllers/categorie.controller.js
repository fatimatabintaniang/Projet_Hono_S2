
import { prisma } from '../config/db.js'
import { categorieCreateSchema, categorieUpdateSchema } from '../schemas/categorie.schema.js'

/* Créer une catégorie */
export const createCategorie = async (c) => {
  try {
    const body = await c.req.json()
    
    // 1. Valider le format avec Zod
    const data = categorieCreateSchema.parse(body)
    
    // 2. VÉRIFIER L'UNICITÉ dans la base de données
    const existingCategorie = await prisma.categorie.findFirst({
      where: {
        nom: {
          equals: data.nom,
          mode: 'insensitive' // Important: insensible à la casse
        }
      }
    })
    
    // 3. Si existe déjà, retourner une erreur
    if (existingCategorie) {
      return c.json({
        success: false,
        error: `La catégorie "${data.nom}" existe déjà`,
        existingId: existingCategorie.id
      }, 409)
    }
    
    // 4. Créer la catégorie
    const categorie = await prisma.categorie.create({ 
      data,
      include: { livres: true }
    })
    
    return c.json({
      success: true,
      data: categorie
    }, 201)
    
  } catch (error) {
    console.error('Erreur création catégorie:', error)
    
    // Gestion des erreurs Zod
    if (error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Données invalides',
        details: error.errors.map(err => ({
          champ: err.path[0],
          message: err.message
        }))
      }, 400)
    }
    
    if (error.code === 'P2002') {
      return c.json({
        success: false,
        error: 'Cette catégorie existe déjà'
      }, 409)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Modifier une catégorie */
export const updateCategorie = async (c) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()
    
    if (isNaN(id) || id <= 0) {
      return c.json({
        success: false,
        error: 'ID invalide'
      }, 400)
    }
    
    // Valider le format
    const data = categorieUpdateSchema.parse(body)
    
    // Vérifier si le nom est fourni et s'il n'existe pas déjà
    if (data.nom) {
      const existingCategorie = await prisma.categorie.findFirst({
        where: {
          AND: [
            { nom: { equals: data.nom, mode: 'insensitive' } },
            { id: { not: id } } // Exclure la catégorie actuelle
          ]
        }
      })
      
      if (existingCategorie) {
        return c.json({
          success: false,
          error: `La catégorie "${data.nom}" existe déjà`,
          existingId: existingCategorie.id
        }, 409)
      }
    }
    
    // Vérifier que la catégorie existe
    const categorieExist = await prisma.categorie.findUnique({
      where: { id }
    })
    
    if (!categorieExist) {
      return c.json({
        success: false,
        error: 'Catégorie introuvable'
      }, 404)
    }
    
    // Mettre à jour
    const categorie = await prisma.categorie.update({
      where: { id },
      data,
      include: { livres: true }
    })
    
    return c.json({
      success: true,
      data: categorie
    })
    
  } catch (error) {
    console.error('Erreur modification catégorie:', error)
    
    if (error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Données invalides',
        details: error.errors.map(err => ({
          champ: err.path[0],
          message: err.message
        }))
      }, 400)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
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



/* Supprimer une catégorie */
export const deleteCategorie = async (c) => {
  const id = Number(c.req.param('id'))

  await prisma.categorie.delete({ where: { id } })
  return c.json({ message: 'Catégorie supprimée' })
}
