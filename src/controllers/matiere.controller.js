import { prisma } from '../config/db.js'
import { matiereSchema } from '../schemas/matiere.schema.js'

/* Récupérer toutes les matières */
export const getMatieres = async (c) => {
  try {
    const matieres = await prisma.matiere.findMany({
      orderBy: { nom_matiere: 'asc' }
    })
    return c.json({
      success: true,
      data: matieres,
      count: matieres.length
    })
  } catch (error) {
    console.error('Erreur récupération matières:', error)
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Créer une matière */
export const createMatiere = async (c) => {
  try {
    const body = await c.req.json()
    
    // 1. Validation du format avec Zod
    const data = matiereSchema.parse(body)
    
    // 2. VÉRIFICATION D'UNICITÉ dans la base de données
    const existingMatiere = await prisma.matiere.findFirst({
      where: {
        nom_matiere: {
          equals: data.nom_matiere,
          mode: 'insensitive' // Insensible à la casse
        }
      }
    })
    
    // 3. Si la matière existe déjà
    if (existingMatiere) {
      return c.json({
        success: false,
        error: `La matière "${data.nom_matiere}" existe déjà`,
        existingId: existingMatiere.id
      }, 409) // 409 = Conflict
    }
    
    // 4. Création de la matière
    const matiere = await prisma.matiere.create({
      data
    })
    
    return c.json({
      success: true,
      message: 'Matière créée avec succès',
      data: matiere
    }, 201)
    
  } catch (error) {
    console.error('Erreur création matière:', error)
    
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
        error: 'Cette matière existe déjà dans la base de données'
      }, 409)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Récupérer une matière par ID */
export const getMatiereById = async (c) => {
  try {
    const { id } = c.req.param()
    const matiereId = parseInt(id)
    
    // Validation de l'ID
    if (isNaN(matiereId) || matiereId <= 0) {
      return c.json({
        success: false,
        error: 'ID invalide'
      }, 400)
    }
    
    const matiere = await prisma.matiere.findUnique({ 
      where: { id: matiereId }
    })
    
    if (!matiere) {
      return c.json({
        success: false,
        error: 'Matière non trouvée'
      }, 404)
    }
    
    return c.json({
      success: true,
      data: matiere
    })
    
  } catch (error) {
    console.error('Erreur récupération matière:', error)
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Mettre à jour une matière */
export const updateMatiere = async (c) => {
  try {
    const { id } = c.req.param()
    const matiereId = parseInt(id)
    const body = await c.req.json()
    
    // Validation de l'ID
    if (isNaN(matiereId) || matiereId <= 0) {
      return c.json({
        success: false,
        error: 'ID invalide'
      }, 400)
    }
    
    // Validation partielle des données
    const data = matiereSchema.partial().parse(body)
    
    // Vérifier si la matière existe
    const matiereExist = await prisma.matiere.findUnique({
      where: { id: matiereId }
    })
    
    if (!matiereExist) {
      return c.json({
        success: false,
        error: 'Matière non trouvée'
      }, 404)
    }
    
    // Vérification d'unicité si le nom est modifié
    if (data.nom_matiere) {
      const existingMatiere = await prisma.matiere.findFirst({
        where: {
          AND: [
            { nom_matiere: { equals: data.nom_matiere, mode: 'insensitive' } },
            { id: { not: matiereId } } // Exclure la matière actuelle
          ]
        }
      })
      
      if (existingMatiere) {
        return c.json({
          success: false,
          error: `La matière "${data.nom_matiere}" existe déjà`,
          existingId: existingMatiere.id
        }, 409)
      }
    }
    
    // Mise à jour
    const matiere = await prisma.matiere.update({
      where: { id: matiereId },
      data
    })
    
    return c.json({
      success: true,
      message: 'Matière mise à jour avec succès',
      data: matiere
    })
    
  } catch (error) {
    console.error('Erreur mise à jour matière:', error)
    
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
        error: 'Cette matière existe déjà'
      }, 409)
    }
    
    if (error.code === 'P2025') {
      return c.json({
        success: false,
        error: 'Matière non trouvée'
      }, 404)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}

/* Supprimer une matière */
export const deleteMatiere = async (c) => {
  try {
    const { id } = c.req.param()
    const matiereId = parseInt(id)
    
    // Validation de l'ID
    if (isNaN(matiereId) || matiereId <= 0) {
      return c.json({
        success: false,
        error: 'ID invalide'
      }, 400)
    }
    
    // Vérifier si la matière existe et ses relations
    const matiere = await prisma.matiere.findUnique({
      where: { id: matiereId }
    })
    
    if (!matiere) {
      return c.json({
        success: false,
        error: 'Matière non trouvée'
      }, 404)
    }

    
    // Suppression
    await prisma.matiere.delete({
      where: { id: matiereId }
    })
    
    return c.json({
      success: true,
      message: `Matière "${matiere.nom_matiere}" supprimée avec succès`
    })
    
  } catch (error) {
    console.error('Erreur suppression matière:', error)
    
    if (error.code === 'P2025') {
      return c.json({
        success: false,
        error: 'Matière non trouvée'
      }, 404)
    }
    
    // Gestion des contraintes de clé étrangère
    if (error.code === 'P2003') {
      return c.json({
        success: false,
        error: 'Impossible de supprimer cette matière car elle est utilisée dans d\'autres tables'
      }, 400)
    }
    
    return c.json({
      success: false,
      error: 'Erreur serveur interne'
    }, 500)
  }
}