import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { z } from 'zod'

const CreateMeetupSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  time: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  barId: z.string().optional(),
  organizerId: z.string().optional()
})

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const items = await prisma.meetup.findMany({ include: { bar: true, rsvps: true, organizer: true } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    const parsed = CreateMeetupSchema.safeParse(req.body)
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    try{
      const body = parsed.data
      const meetup = await prisma.meetup.create({
        data: {
          title: body.title,
          description: body.description || '',
          time: body.time ? new Date(body.time) : null,
          capacity: body.capacity ?? 20,
          tags: body.tags || [],
          bar: body.barId ? { connect: { id: body.barId } } : undefined,
          organizer: body.organizerId ? { connect: { id: body.organizerId } } : undefined,
        }
      })

      res.status(201).json(meetup)
    }catch(err){
      res.status(500).json({ error: String(err) })
    }
    return
  }

  res.status(405).json({ error:'method not allowed' })
}
