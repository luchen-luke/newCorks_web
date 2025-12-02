import prisma from '../../lib/prisma'

export default async function handler(req, res){
  if(req.method === 'GET'){
    const items = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
    res.status(200).json(items)
    return
  }

  if(req.method === 'POST'){
    try{
      const body = req.body || {}
      const article = await prisma.article.create({ data: { title: body.title || 'Untitled', excerpt: body.excerpt || '', content: body.content || '', tags: body.tags || [] } })
      res.status(201).json(article)
      return
    }catch(err){
      res.status(500).json({error: err.message})
    }
  }

  res.status(405).json({ error: 'method not allowed' })
}

