import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  const { name, email, phone, password } = req.body || {}
  if(!password || (!email && !phone)) return res.status(400).json({ error: 'email or phone and password required' })

  try{
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, phone, password: hashed } })
    // return limited user
    res.status(201).json({ id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt })
  }catch(err){
    res.status(500).json({ error: err.message })
  }
}
