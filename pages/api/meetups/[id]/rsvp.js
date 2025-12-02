import prisma from '../../../../../lib/prisma'
import { getUserFromHeader } from '../../../../../lib/auth'

export default async function handler(req, res){
  const { id } = req.query // meetup id
  const user = await getUserFromHeader(req)
  if(!user) return res.status(401).json({ error: 'unauthorized' })

  if(req.method === 'POST'){
    try{
      const rsvp = await prisma.rSVP.create({ data: { userId: user.id, meetupId: id, status: 'going' } })
      // increment attendees count in meetup
      await prisma.meetup.update({ where: { id }, data: { attendees: { increment: 1 } } })
      res.status(201).json(rsvp)
    }catch(err){
      res.status(500).json({ error: err.message })
    }
    return
  }

  if(req.method === 'DELETE'){
    try{
      await prisma.rSVP.deleteMany({ where: { userId: user.id, meetupId: id } })
      await prisma.meetup.update({ where: { id }, data: { attendees: { decrement: 1 } } })
      res.status(200).json({ ok: true })
    }catch(err){
      res.status(500).json({ error: err.message })
    }
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
