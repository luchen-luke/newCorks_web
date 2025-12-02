import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromHeader } from '../../../../lib/auth'
import { z } from 'zod'

const CommentSchema = z.object({ content: z.string().min(1) })

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query // post id
  if(req.method === 'GET'){
    const comments = await prisma.comment.findMany({ where: { postId: String(id) }, orderBy: { createdAt: 'asc' }, include: { author: true } })
    res.status(200).json(comments)
    return
  }

  const user = await getUserFromHeader(req)
  if(!user) return res.status(401).json({ error: 'unauthorized' })

  if(req.method === 'POST'){
    const parsed = CommentSchema.safeParse(req.body)
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    try{
      const { content } = parsed.data
      const comment = await prisma.comment.create({ data: { postId: String(id), authorId: user.id, content } })
      res.status(201).json(comment)
    }catch(err){
      res.status(500).json({ error: String(err) })
    }
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
