import prisma from '../../lib/prisma'

export default async function handler(req, res){
  if(req.method === 'GET'){
    const items = await prisma.meetup.findMany({ include: { bar: true, rsvps: true, organizer: true } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    try{
      const body = req.body || {}
      const meetup = await prisma.meetup.create({
        data: {
          title: body.title || 'Untitled',
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
      res.status(500).json({ error: err.message })
    }
    return
  }

  res.status(405).json({ error:'method not allowed' })
}
