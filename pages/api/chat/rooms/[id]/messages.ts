import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  if(req.method === 'GET'){
    const messages = await prisma.message.findMany({ where: { roomId: String(id) }, orderBy: { createdAt: 'asc' }, include: { author: true } })
    res.status(200).json(messages)
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
