import prisma from '../../lib/prisma'

export default async function handler(req, res){
  if(req.method === 'GET'){
    const items = await prisma.post.findMany({ include: { comments: true, author: true }, orderBy: { createdAt: 'desc' } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    try{
      const body = req.body || {}
      const post = await prisma.post.create({ data: {
        content: body.content || '',
        author: body.authorId ? { connect: { id: body.authorId } } : undefined
      }})
      res.status(201).json(post)
    }catch(err){
      res.status(500).json({error:err.message})
    }
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}

