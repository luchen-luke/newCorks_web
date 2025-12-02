import prisma from '../../lib/prisma'

export default async function handler(req, res){
  if(req.method === 'GET'){
    const items = await prisma.bar.findMany({ include: { meetups: true } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    try{
      const body = req.body || {}
      const bar = await prisma.bar.create({ data: {
        name: body.name || 'Untitled',
        area: body.area || '',
        vibe: body.vibe || '',
        avg: body.avg ? Number(body.avg) : null,
        tags: body.tags || []
      }})
      res.status(201).json(bar)
      return
    }catch(err){
      res.status(500).json({error:err.message})
    }
  }

  res.status(405).json({ error: 'method not allowed' })
}

