import { Server } from 'socket.io'
import prisma from '../../lib/prisma'
import Redis from 'ioredis'

export default function handler(req, res){
  if (!res.socket.server.io) {
    console.log('✨ Socket.io server initializing...')
    const io = new Server(res.socket.server)

    // If REDIS_URL is provided, attach adapter for scaling (optional)
    if(process.env.REDIS_URL){
      try{
        const redis = new Redis(process.env.REDIS_URL)
        // NOTE: For a real Redis adapter, you'd use socket.io-redis, but here we just show connection
        console.log('Connected to Redis for socket support')
      }catch(err){
        console.warn('Redis connection for socket adapter failed', err.message)
      }
    }

    io.on('connection', socket => {
      console.log('Socket connected:', socket.id)

      socket.on('join', (roomId) => {
        socket.join(roomId)
      })

      socket.on('message', async ({ roomId, userId, text }) => {
        try{
          // persist message
          const msg = await prisma.message.create({ data: { roomId, authorId: userId || null, text } })
          io.to(roomId).emit('message', msg)
        }catch(err){
          console.error('failed to save message', err.message)
        }
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
  }
  res.end()
}
