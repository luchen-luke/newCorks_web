import { useEffect, useState, useRef } from 'react'

type User = { id?: string, name?: string } | null
type Message = { id: string, text: string, author?: { name?: string } }

let socket: any

export default function ChatRoom({ roomId, user }: { roomId: string, user?: User }){
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const mounted = useRef(false)

  useEffect(()=>{
    async function init(){
      // ensure /api/socket has initialized server
      await fetch('/api/socket')
      // dynamically import socket.io-client to avoid module resolution/SSR issues
      if(!socket){
        const module = await import('socket.io-client')
        // socket.io-client typings vary between default export and named exports across builds;
        // cast to any and try common properties to avoid TypeScript build-time errors
        const anyMod: any = module
        const io = anyMod.default || anyMod.connect || anyMod
        socket = io()
      }
      socket.emit('join', roomId)

      socket.on('message', (msg: Message) => {
        setMessages(prev => [...prev, msg])
      })

      const res = await fetch(`/api/chat/rooms/${roomId}/messages`)
      const data = await res.json()
      setMessages(data)
    }

    if(!mounted.current){
      init()
      mounted.current = true
    }

    return ()=>{
      if(socket) socket.off('message')
    }
  }, [roomId])

  function send(){
    if(!text) return
    socket.emit('message', { roomId, userId: user?.id, text })
    setText('')
  }

  return (
    <div className="card">
      <div style={{fontWeight:800,marginBottom:8}}>房间：{roomId}</div>
      <div style={{maxHeight:260,overflowY:'auto',padding:6,border:'1px solid rgba(255,255,255,0.02)',borderRadius:8}}>
        {messages.map(m=> (
          <div key={m.id} style={{padding:6,borderBottom:'1px solid rgba(255,255,255,0.02)'}}>
            <div style={{fontWeight:700}}>{m.author?.name || '匿名'}</div>
            <div className="muted small">{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="发送消息" style={{flex:1,padding:8,borderRadius:8}} />
        <button className="btn" onClick={send}>发送</button>
      </div>
    </div>
  )
}
