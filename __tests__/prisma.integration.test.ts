import prisma from '../lib/prisma'

describe('Prisma integration', () => {
  test('should find seeded data or be able to create records', async () => {
    // try find at least one bar
    const bars = await prisma.bar.findMany({ take: 1 })
    if(bars.length === 0){
      // create a sample bar
      const b = await prisma.bar.create({ data: { name: 'Test Bar', area: 'CI', vibe: 'test', avg: 50 } })
      expect(b.name).toBe('Test Bar')
    }else{
      expect(bars[0]).toHaveProperty('name')
    }
  })

  test('can create a chat message and retrieve it', async () => {
    const room = await prisma.chatRoom.create({ data: { name: 'ci-room' } })
    const msg = await prisma.message.create({ data: { roomId: room.id, text: 'hello world' } })
    expect(msg.text).toBe('hello world')
    const found = await prisma.message.findUnique({ where: { id: msg.id } })
    expect(found).not.toBeNull()
  })
})
