import { prisma } from '../config/db.js'
import { niveauSchema } from '../schemas/niveau.schema.js'

/* Récupérer tous les niveaux */
export const getNiveaux = async (c) => {
  try {
    const niveaux = await prisma.niveau.findMany({
      orderBy: { libelle: 'asc' }
    })
    
    return c.json({
      success: true,
      data: niveaux,
      count: niveaux.length
    })
    
  } catch (error) {
    console.error('Erreur récupération niveaux:', error)
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Créer un niveau */
export const createNiveau = async (c) => {
  try {
    const body = await c.req.json()
    
    // 1. Validation du format avec Zod
    const data = niveauSchema.parse(body)
    
    // 2. VÉRIFICATION D'UNICITÉ dans la base de données
    const existingNiveau = await prisma.niveau.findFirst({
      where: {
        libelle: {
          equals: data.libelle,
          mode: 'insensitive' // Insensible à la casse
        }
      }
    })
    
    // 3. Si le niveau existe déjà
    if (existingNiveau) {
      return c.json({
        success: false,
        error: `Le niveau "${data.libelle}" existe déjà`,
        existingId: existingNiveau.id
      }, 409) // 409 = Conflict
    }
    
    // 4. Création du niveau
    const niveau = await prisma.niveau.create({
      data
    })
    
    return c.json({
      success: true,
      message: 'Niveau créé avec succès',
      data: niveau
    }, 201)
    
  } catch (error) {
    console.error('Erreur création niveau:', error)
    
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
    
    // Erreur d'unicité Prisma (si @unique est défini dans le schéma)
    if (error.code === 'P2002') {
      return c.json({
        success: false,
        error: 'Ce niveau existe déjà dans la base de données'
      }, 409)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Récupérer un niveau par ID */
export const getNiveauById = async (c) => {
  try {
    const { id } = c.req.param()
    const niveauId = parseInt(id)
    
    // Validation de l'ID
    if (isNaN(niveauId) || niveauId <= 0) {
      return c.json({
        success: false,
        error: 'ID invalide'
      }, 400)
    }
    
    const niveau = await prisma.niveau.findUnique({ 
      where: { id: niveauId }
    })
    
    if (!niveau) {
      return c.json({
        success: false,
        error: 'Niveau non trouvé'
      }, 404)
    }
    
    return c.json({
      success: true,
      data: niveau
    })
    
  } catch (error) {
    console.error('Erreur récupération niveau:', error)
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Mettre à jour un niveau */
export const updateNiveau = async (c) => {
  try {
    const { id } = c.req.param()
    const niveauId = parseInt(id)
    const body = await c.req.json()
    
    // Validation de l'ID
    if (isNaN(niveauId) || niveauId <= 0) {
      return c.json({
        success: false,
        error: 'ID invalide'
      }, 400)
    }
    
    // Validation partielle des données
    const data = niveauSchema.partial().parse(body)
    
    // Vérifier si le niveau existe
    const niveauExist = await prisma.niveau.findUnique({
      where: { id: niveauId }
    })
    
    if (!niveauExist) {
      return c.json({
        success: false,
        error: 'Niveau non trouvé'
      }, 404)
    }
    
    // Vérification d'unicité si le libellé est modifié
    if (data.libelle) {
      const existingNiveau = await prisma.niveau.findFirst({
        where: {
          AND: [
            { libelle: { equals: data.libelle, mode: 'insensitive' } },
            { id: { not: niveauId } } // Exclure le niveau actuel
          ]
        }
      })
      
      if (existingNiveau) {
        return c.json({
          success: false,
          error: `Le niveau "${data.libelle}" existe déjà`,
          existingId: existingNiveau.id
        }, 409)
      }
    }
    
    // Mise à jour
    const niveau = await prisma.niveau.update({
      where: { id: niveauId },
      data
    })
    
    return c.json({
      success: true,
      message: 'Niveau mis à jour avec succès',
      data: niveau
    })
    
  } catch (error) {
    console.error('Erreur mise à jour niveau:', error)
    
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
        error: 'Ce niveau existe déjà'
      }, 409)
    }
    
    if (error.code === 'P2025') {
      return c.json({
        success: false,
        error: 'Niveau non trouvé'
      }, 404)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Supprimer un niveau */
export const deleteNiveau = async (c) => {
  try {
    const { id } = c.req.param()
    const niveauId = parseInt(id)
    
    // Validation de l'ID
    if (isNaN(niveauId) || niveauId <= 0) {
      return c.json({
        success: false,
        error: 'ID invalide'
      }, 400)
    }
    
    // Vérifier si le niveau existe et ses relations
    const niveau = await prisma.niveau.findUnique({
      where: { id: niveauId }
    })
    
    if (!niveau) {
      return c.json({
        success: false,
        error: 'Niveau non trouvé'
      }, 404)
    }

    
    // Suppression
    await prisma.niveau.delete({
      where: { id: niveauId }
    })
    
    return c.json({
      success: true,
      message: `Niveau "${niveau.libelle}" supprimé avec succès`
    })
    
  } catch (error) {
    console.error('Erreur suppression niveau:', error)
    
    if (error.code === 'P2025') {
      return c.json({
        success: false,
        error: 'Niveau non trouvé'
      }, 404)
    }
    
    // Gestion des contraintes de clé étrangère
    if (error.code === 'P2003') {
      return c.json({
        success: false,
        error: 'Impossible de supprimer ce niveau car il est utilisé dans d\'autres tables'
      }, 400)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}