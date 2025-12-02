import prisma from '../../../../lib/prisma'

export default async function handler(req, res){
  const { id } = req.query
  if(req.method === 'GET'){
    const messages = await prisma.message.findMany({ where: { roomId: id }, orderBy: { createdAt: 'asc' }, include: { author: true } })
    res.status(200).json(messages)
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
