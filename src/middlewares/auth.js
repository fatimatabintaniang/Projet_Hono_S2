import { verifyToken } from '../utils/jwt.js'


export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ message: 'Missing or invalid token' }, 401)
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token) 
    c.set('userId', decoded.userId)
    await next()
  } catch {
    return c.json({ message: 'Invalid or expired token' }, 401)
  }
}
