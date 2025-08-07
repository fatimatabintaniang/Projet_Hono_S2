import bcrypt from 'bcrypt'
import { prisma } from '../config/db.js'
import { signToken } from '../utils/jwt.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'


/* ---------------- Register ---------------- */
export const register = async (c) => {
  const body = await c.req.json()
  const { prenom, nom, adresse, email, password } = registerSchema.parse(body)


  const hashed = await bcrypt.hash(password, 10)


  const user = await prisma.user.create({
    data: { prenom, nom, adresse, email, password: hashed },
  })


  return c.json({ id: user.id, email: user.email })
}


/* ---------------- Login ---------------- */
export const login = async (c) => {
  const body = await c.req.json()
  const { email, password } = loginSchema.parse(body)   // ← corrigé


  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ message: 'Invalid credentials' }, 401)
  }


  const token = signToken({ userId: user.id })
  return c.json({ token })
}
