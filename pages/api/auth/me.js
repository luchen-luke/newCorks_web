import prisma from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req, res){
  if(req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' })
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if(!token) return res.status(401).json({ error: 'no token' })

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } })
    if(!user) return res.status(404).json({ error: 'user not found' })
    res.status(200).json({ id: user.id, name: user.name, email: user.email, phone: user.phone })
  }catch(err){
    res.status(401).json({ error: 'invalid token' })
  }
}
