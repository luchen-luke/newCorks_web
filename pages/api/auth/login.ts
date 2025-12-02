import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const LoginSchema = z.object({ identifier: z.string().min(1), password: z.string().min(1) })

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  const parsed = LoginSchema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { identifier, password } = parsed.data
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }] } })
  if(!user || !user.password) return res.status(401).json({ error: 'invalid credentials' })

  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return res.status(401).json({ error: 'invalid credentials' })

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
  res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } })
}
