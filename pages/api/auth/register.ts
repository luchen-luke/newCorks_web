import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  password: z.string().min(6)
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  const parsed = RegisterSchema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { name, email, phone, password } = parsed.data
  try{
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, phone, password: hashed } })
    res.status(201).json({ id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt })
  }catch(err){
    res.status(500).json({ error: String(err) })
  }
}
