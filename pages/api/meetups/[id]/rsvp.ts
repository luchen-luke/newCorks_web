import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getUserFromHeader } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  const user = await getUserFromHeader(req)
  if(!user) return res.status(401).json({ error: 'unauthorized' })

  if(req.method === 'POST'){
    try{
      const existing = await prisma.rSVP.findUnique({ where: { userId_meetupId: { userId: user.id, meetupId: String(id) } } }).catch(()=>null)
      if(existing) return res.status(400).json({ error: 'already rsvped' })
      await prisma.rSVP.create({ data: { userId: user.id, meetupId: String(id), status: 'going' } })
      await prisma.meetup.update({ where: { id: String(id) }, data: { attendees: { increment: 1 } } })
      res.status(201).json({ ok: true })
      return
    }catch(err){
      res.status(500).json({ error: String(err) })
      return
    }
  }

  if(req.method === 'DELETE'){
    try{
      await prisma.rSVP.delete({ where: { userId_meetupId: { userId: user.id, meetupId: String(id) } } })
      await prisma.meetup.update({ where: { id: String(id) }, data: { attendees: { decrement: 1 } } })
      res.status(200).json({ ok: true })
      return
    }catch(err){
      res.status(500).json({ error: String(err) })
      return
    }
  }

  res.status(405).json({ error: 'method not allowed' })
}
