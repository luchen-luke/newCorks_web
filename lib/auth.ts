import jwt from 'jsonwebtoken'
import prisma from './prisma'

export async function getUserFromHeader(req: { headers?: { authorization?: string } }){
  const auth = req.headers?.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if(!token) return null
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { sub?: string }
    if(!decoded?.sub) return null
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } })
    return user
  }catch(err){
    return null
  }
}
