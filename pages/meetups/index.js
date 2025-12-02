import { useState } from 'react'
import { useAuth } from '../../lib/useAuth'
import Layout from '../../components/Layout'
import useSWR from 'swr'

const fetcher = (url)=> fetch(url).then(r=>r.json())

export default function Meetups(){
  const { data, mutate } = useSWR('/api/meetups', fetcher, {refreshInterval:0})
  const auth = useAuth()
  const [title,setTitle] = useState('')
  const [bar, setBar] = useState('')

  async function create(){
    if(!title || !bar) return alert('请输入标题和酒吧')
    const res = await fetch('/api/meetups', {method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({title,bar})})
    const body = await res.json()
    setTitle(''); setBar('')
    mutate()
    alert('已创建：' + (body.title || ''))
  }

  return (
    <Layout>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        <div style={{flex:1}}>
          <h2>聚会列表</h2>
          <div className="muted">查看附近 / 推荐 / 即将开始的聚会</div>
        </div>
        <div style={{width:380}} className="card">
          <div style={{fontWeight:800}}>创建聚会</div>
          <div style={{marginTop:10}}>
            <input placeholder="活动标题" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.03)',marginBottom:8}} />
            <input placeholder="酒吧（示例：Amber Bar）" value={bar} onChange={e=>setBar(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.03)',marginBottom:8}} />
            <div style={{display:'flex',justifyContent:'flex-end'}}><button className="btn" onClick={create}>创建</button></div>
          </div>
        </div>
      </div>

      <div style={{marginTop:18}}>
        {!data ? <div className="muted">加载中…</div> : (
          <div className="grid">
            {data.map(m=> (
              <div className="card" key={m.id}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:800}}>{m.title}</div>
                    <div className="muted small">{m.bar} • {m.time || '待定'}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="badge">{m.attendees}/{m.capacity}</div>
                    <div style={{marginTop:8}}>
                      <button className="small btn" onClick={async ()=>{
                        if(!auth.user) return alert('请先登录再报名')
                        const res = await fetch(`/api/meetups/${m.id}/rsvp`, { method: 'POST', headers: { Authorization: 'Bearer ' + (auth.token || '' ) } })
                        if(res.ok) { mutate(); alert('已报名') } else { const d = await res.json(); alert(JSON.stringify(d)) }
                      }}>报名</button>
                    </div>
                  </div>
                </div>
                <div style={{marginTop:8}} className="muted small">标签：{(m.tags||[]).join(' · ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
