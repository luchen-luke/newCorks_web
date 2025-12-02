import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  const { identifier, password } = req.body || {}
  if(!identifier || !password) return res.status(400).json({ error: 'identifier and password required' })

  // identifier = email or phone
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }] } })
  if(!user) return res.status(401).json({ error: 'invalid credentials' })

  const ok = await bcrypt.compare(password, user.password || '')
  if(!ok) return res.status(401).json({ error: 'invalid credentials' })

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
  res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } })
}
