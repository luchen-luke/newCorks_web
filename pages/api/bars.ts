import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { z } from 'zod'

const CreateBarSchema = z.object({ name: z.string().min(1), area: z.string().optional(), vibe: z.string().optional(), avg: z.number().int().optional(), tags: z.array(z.string()).optional() })

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const items = await prisma.bar.findMany({ include: { meetups: true } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    const parsed = CreateBarSchema.safeParse(req.body)
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    try{
      const body = parsed.data
      const bar = await prisma.bar.create({ data: { name: body.name, area: body.area || '', vibe: body.vibe || '', avg: body.avg ?? null, tags: body.tags || [] } })
      res.status(201).json(bar)
      return
    }catch(err){
      res.status(500).json({ error: String(err) })
    }
  }

  res.status(405).json({ error: 'method not allowed' })
}
