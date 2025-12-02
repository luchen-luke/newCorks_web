const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const sample = require('../data/sampleData')

async function main(){
  console.log('Seeding DB...')
  await prisma.post.deleteMany().catch(()=>{})
  await prisma.comment.deleteMany().catch(()=>{})
  await prisma.meetup.deleteMany().catch(()=>{})
  await prisma.bar.deleteMany().catch(()=>{})
  await prisma.user.deleteMany().catch(()=>{})

  // users
  for(const u of sample.users){
    await prisma.user.create({ data: { id: u.id, name: u.name } }).catch(()=>{})
  }

  for(const b of sample.bars){
    await prisma.bar.create({ data: { id: b.id, name: b.name, area: b.area, vibe: b.vibe, avg: b.avg, tags: b.tags } }).catch(()=>{})
  }

  for(const m of sample.meetups){
    await prisma.meetup.create({ data: { id: m.id, title: m.title, time: m.time ? new Date(m.time) : null, capacity: m.capacity, attendees: m.attendees, tags: m.tags, description: '' } }).catch(()=>{})
  }

  for(const a of sample.articles){
    await prisma.article.create({ data: { id: a.id, title: a.title, excerpt: a.excerpt } }).catch(()=>{})
  }

  for(const p of sample.posts){
    await prisma.post.create({ data: { id: p.id, content: p.content, likes: p.likes } }).catch(()=>{})
  }

  console.log('Seed complete')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
