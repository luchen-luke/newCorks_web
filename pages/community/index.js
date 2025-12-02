import { useState } from 'react'
import Layout from '../../components/Layout'
import useSWR from 'swr'
import ChatRoom from '../../components/ChatRoom'
import { useAuth } from '../../lib/useAuth'

const fetcher = url => fetch(url).then(r=>r.json())

export default function Community(){
  const { data, mutate } = useSWR('/api/posts', fetcher)
  const auth = useAuth()
  const [content,setContent] = useState('')

  async function publish(){
    if(!content) return
    await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content, authorId: auth?.user?.id})})
    setContent('')
    mutate()
  }

  return (
    <Layout>
      <h2>社区</h2>
      <div className="muted">内容流：酒评 • 酒吧探店 • 聚会照片 • 问答</div>

      <div style={{marginTop:14}} className="card">
        <div style={{fontWeight:800}}>发布新内容</div>
        <textarea placeholder="说点什么吧" value={content} onChange={e=>setContent(e.target.value)} style={{width:'100%',marginTop:10,minHeight:80,padding:10}} />
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}><button className="btn" onClick={publish}>发布</button></div>
      </div>

      <div style={{marginTop:18}}>
        <h3>实时群聊</h3>
        <ChatRoom roomId={'general'} user={auth.user} />
      </div>

      <div style={{marginTop:18}}>
        {!data ? <div className="muted">加载中…</div> : (
          <div>
            {data.map(p=> (
              <div key={p.id} className="card" style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:800}}>{p.author || '匿名'}</div>
                    <div className="muted small">{p.content}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="muted small">点赞 {p.likes}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
