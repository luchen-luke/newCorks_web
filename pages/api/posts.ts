import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { z } from 'zod'

const CreatePostSchema = z.object({ content: z.string().min(1), authorId: z.string().optional() })

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const items = await prisma.post.findMany({ include: { comments: true, author: true }, orderBy: { createdAt: 'desc' } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    const parsed = CreatePostSchema.safeParse(req.body)
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    try{
      const body = parsed.data
      const post = await prisma.post.create({ data: { content: body.content, author: body.authorId ? { connect: { id: body.authorId } } : undefined } })
      res.status(201).json(post)
      return
    }catch(err){
      res.status(500).json({ error: String(err) })
    }
  }

  res.status(405).json({ error: 'method not allowed' })
}
