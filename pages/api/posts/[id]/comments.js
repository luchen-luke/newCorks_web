import prisma from '../../../../../lib/prisma'
import { getUserFromHeader } from '../../../../../lib/auth'

export default async function handler(req, res){
  const { id } = req.query // post id
  if(req.method === 'GET'){
    const comments = await prisma.comment.findMany({ where: { postId: id }, orderBy: { createdAt: 'asc' }, include: { author: true } })
    res.status(200).json(comments)
    return
  }

  const user = await getUserFromHeader(req)
  if(!user) return res.status(401).json({ error: 'unauthorized' })

  if(req.method === 'POST'){
    try{
      const { content } = req.body || {}
      const comment = await prisma.comment.create({ data: { postId: id, authorId: user.id, content } })
      res.status(201).json(comment)
    }catch(err){
      res.status(500).json({ error: err.message })
    }
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
