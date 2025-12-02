import prisma from '../../../../lib/prisma'
import { getUserFromHeader } from '../../../../lib/auth'

export default async function handler(req, res){
  const { id } = req.query
  if(req.method === 'GET'){
    const item = await prisma.bar.findUnique({ where: { id }, include: { meetups: true } })
    if(!item) return res.status(404).json({ error: 'not found' })
    res.status(200).json(item)
    return
  }

  const user = await getUserFromHeader(req)
  if(!user) return res.status(401).json({ error: 'unauthorized' })

  if(req.method === 'PUT'){
    try{
      const body = req.body || {}
      const updated = await prisma.bar.update({ where: { id }, data: { name: body.name, area: body.area, vibe: body.vibe, avg: body.avg ? Number(body.avg) : undefined, tags: body.tags } })
      res.status(200).json(updated)
    }catch(err){
      res.status(500).json({ error: err.message })
    }
    return
  }

  if(req.method === 'DELETE'){
    try{
      await prisma.bar.delete({ where: { id } })
      res.status(200).json({ ok: true })
    }catch(err){
      res.status(500).json({ error: err.message })
    }
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
