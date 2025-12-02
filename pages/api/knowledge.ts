import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { z } from 'zod'

const CreateArticleSchema = z.object({ title: z.string().min(1), excerpt: z.string().optional(), content: z.string().optional(), tags: z.array(z.string()).optional() })

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const items = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    const parsed = CreateArticleSchema.safeParse(req.body)
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    try{
      const body = parsed.data
      const article = await prisma.article.create({ data: { title: body.title, excerpt: body.excerpt || '', content: body.content || '', tags: body.tags || [] } })
      res.status(201).json(article)
      return
    }catch(err){
      res.status(500).json({ error: String(err) })
    }
  }

  res.status(405).json({ error: 'method not allowed' })
}
