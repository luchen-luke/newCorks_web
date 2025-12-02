import Link from 'next/link'
import Layout from '../components/Layout'
import { meetups, bars } from '../data/sampleData'

export default function Home(){
  return (
    <Layout>
      <div className="hero">
        <div style={{flex:1}}>
          <h1>Corks — 城市酒类社交</h1>
          <div className="muted">探索酒吧、创建聚会、学习酒类知识并结识同好</div>
          <div style={{marginTop:16}}>
            <Link href="/meetups" legacyBehavior><a className="btn">查找附近聚会</a></Link>
          </div>
        </div>
        <div style={{width:320}} className="card">
          <div style={{fontWeight:800}}>即将开始的聚会</div>
          <div style={{marginTop:10}}>
            {meetups.slice(0,3).map(m=> (
              <div key={m.id} className="list-item">
                <div>
                  <div style={{fontWeight:700}}>{m.title}</div>
                  <div className="muted small">{m.bar} • {m.time}</div>
                </div>
                <div className="badge">{m.attendees}/{m.capacity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 style={{marginTop:24}}>附近推荐酒吧</h3>
      <div className="grid">
        {bars.map(b=> (
          <div key={b.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:800}}>{b.name}</div>
                <div className="muted small">{b.vibe} • {b.area}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="badge">¥{b.avg}</div>
                <div style={{marginTop:8}}><Link href={'/bars'} legacyBehavior><a className="small">查看</a></Link></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
