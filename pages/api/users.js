import prisma from '../../lib/prisma'

export default async function handler(req, res){
  if(req.method === 'GET'){
    const items = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, createdAt: true } })
    res.status(200).json(items)
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
