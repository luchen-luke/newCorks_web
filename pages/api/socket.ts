import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import prisma from '../../lib/prisma'
import Redis from 'ioredis'

type NextSocketApiResponse = NextApiResponse & { socket: { server: any } }

export default function handler(req: NextApiRequest, res: NextSocketApiResponse){
  if (!res.socket.server.io) {
    console.log('✨ Socket.io server initializing...')
    const io = new Server(res.socket.server)

      if(process.env.REDIS_URL){
      try{
        const redis = new Redis(process.env.REDIS_URL)
        console.log('Connected to Redis for socket support')
      }catch(err){
        // err is unknown in TS catch; coerce to Error for message access and safe logging
        const e = err instanceof Error ? err : new Error(String(err))
        console.warn('Redis connection for socket adapter failed', e.message)
      }
    }

    io.on('connection', socket => {
      console.log('Socket connected:', socket.id)

      socket.on('join', (roomId: string) => {
        socket.join(roomId)
      })

      socket.on('message', async ({ roomId, userId, text }: { roomId: string, userId?: string, text: string }) => {
        try{
          const msg = await prisma.message.create({ data: { roomId, authorId: userId || null, text } })
          io.to(roomId).emit('message', msg)
        }catch(err){
          console.error('failed to save message', err)
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
