import { prisma } from '../config/db.js'
import { telechargementSchema } from '../schemas/telechargement.schema.js'

/* Récupérer tous les téléchargements */
export const getTelechargements = async (c)=>{
    const telechargements = await prisma.historiqueTelechargement.findMany()
    return c.json(telechargements) 
}

/* Créer un téléchargement */
export const createTelechargement = async (c) => {
  try {
    const body = await c.req.json()

    // Validation Zod
    const data = telechargementSchema.parse(body)

    const telechargement =
      await prisma.historiqueTelechargement.create({
        data: {
          date_telechargement: new Date(), // ou @default(now())
          userId: data.userId,
        livreId: data.livreId,
         
        },
      })

    return c.json(telechargement, 201)
  } catch (error) {
    console.error(error)
    return c.json({ message: error.message }, 400)
  }
}



/* Récupérer un téléchargement par ID */
export const getTelechargementById = async (c) => {
    const {id} = c.req.param()
    
    // Convertir l'id en nombre si c'est un ID numérique
    const idNum = parseInt(id)
    
    const telechargement = await prisma.historiqueTelechargement.findUnique({ 
        where: { id: idNum } 
    })
    
    if(!telechargement){
        return c.json({message: 'Téléchargement non trouvé'},404)
    }
    return c.json(telechargement)
}


/* Mettre à jour un téléchargement */
export const updateTelechargement = async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    // Utiliser .partial() pour permettre des updates partielles
    const data = telechargementSchema.partial().parse(body);
    
    // Convertir l'id en nombre
    const idNum = parseInt(id);
    
    const telechargement = await prisma.historiqueTelechargement.update({
      where: { id: idNum },
      data
    });
    
    return c.json(telechargement);
  } catch (error) {
    console.error('Erreur update:', error);
    
    // Gestion spécifique des erreurs
    if (error.name === 'ZodError') {
      return c.json({ 
        message: 'Validation échouée',
        errors: error.errors 
      }, 400);
    }
    
    if (error.code === 'P2025') {
      return c.json({ message: 'Téléchargement non trouvé' }, 404);
    }
    
    return c.json({ 
      message: 'Erreur serveur',
      error: error.message 
    }, 500);
  }
};

/* Supprimer un téléchargement */
export const deleteTelechargement = async (c)=>{
    const {id} = c.req.param()
     const idNum = parseInt(id)
    try{
        await prisma.historiqueTelechargement.delete({
            where: {id : idNum}
        })
        return c.json({message: 'Téléchargement supprimé avec succès'})
    } catch (error){
        return c.json({message: 'Téléchargement non trouvé'},404)
    }
}      
