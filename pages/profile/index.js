import Layout from '../../components/Layout'
import { users } from '../../data/sampleData'

export default function Profile(){
  const u = users[0]
  return (
    <Layout>
      <div style={{display:'flex',gap:18,alignItems:'center'}}>
        <div className="card" style={{width:120,height:120,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800}}>👤</div>
        <div>
          <div style={{fontSize:22,fontWeight:800}}>{u.name}</div>
          <div className="muted small">兴趣：{u.tag.join(' · ')}</div>
          <div style={{marginTop:8}} className="muted small">已参加聚会：{u.joined}</div>
        </div>
      </div>

      <div style={{marginTop:18}} className="card">
        <div style={{fontWeight:800}}>我的聚会</div>
        <div className="muted small">（在 Meetups 页面查看 / 管理）</div>
      </div>

      <div style={{marginTop:12}} className="card">
        <div style={{fontWeight:800}}>成就</div>
        <div style={{marginTop:8}} className="muted small">初级酒友 • 聚会达人</div>
      </div>
    </Layout>
  )
}
