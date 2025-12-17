import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { signToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { cloudinary } from '../config/cloudinary.js';

export const register = async (c) => {
  // Récupérer le header content-type
  const contentType = c.req.header('content-type') || '';

  // Selon le content-type, parser différemment
  let body;
  if (contentType.includes('application/json')) {
    body = await c.req.json();
  } else {
    // multipart/form-data
    body = await c.req.parseBody();
  }

  // Extraire les champs
  const prenom = body.prenom;
  const nom = body.nom;
  const telephone = body.telephone;
  const email = body.email;
  const password = body.password;
  const role = body.role || 'ETUDIANT';
  const file = body.image;

  // Validation avec Zod
  registerSchema.parse({ prenom, nom, telephone, email, password });

  // Upload image vers Cloudinary si présent et type file
  let imageUrl = '';
  if (file && file.type === 'file') {
    // Conversion buffer en base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    // Construire data URI
    const dataURI = `data:${file.mimetype || file.type};base64,${base64}`;

    // Upload
    const uploadRes = await cloudinary.uploader.upload(dataURI, {
      folder: 'users',
    });
    imageUrl = uploadRes.secure_url;
  }

  // Hasher le mot de passe
  const hashed = await bcrypt.hash(password, 10);

  // Enregistrer l'utilisateur dans la DB
  const user = await prisma.user.create({
    data: {
      prenom,
      nom,
      telephone,
      email,
      password: hashed,
      image: imageUrl,
      role,
    },
  });

  // Réponse avec ID et email
  return c.json({ id: user.id, email: user.email });
};

export const login = async (c) => {
  // Lecture du corps JSON
  const body = await c.req.json();

  // Validation avec Zod
  const { email, password } = loginSchema.parse(body);

  // Recherche utilisateur par email
  const user = await prisma.user.findUnique({ where: { email } });

  // Vérifier utilisateur + mot de passe
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  // Générer token JWT
  const token = signToken({ userId: user.id });

  // Répondre avec token
  return c.json({ token });
};
