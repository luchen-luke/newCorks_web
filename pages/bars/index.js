import Layout from '../../components/Layout'
import useSWR from 'swr'

const fetcher = (url)=>fetch(url).then(r=>r.json())

export default function Bars(){
  const { data } = useSWR('/api/bars', fetcher)

  return (
    <Layout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2>酒吧探索</h2>
          <div className="muted">地图模式 / 列表 / 筛选（示例）</div>
        </div>
        <div className="badge">筛选：人均 • 距离</div>
      </div>

      <div style={{marginTop:16}}>
        {!data ? <div className="muted">加载中…</div> : (
          <div className="grid">
            {data.map(b=> (
              <div key={b.id} className="card">
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:800}}>{b.name}</div>
                    <div className="muted small">{b.vibe} • {b.area}</div>
                    <div style={{marginTop:8}} className="muted small">标签: {b.tags.join(' · ')}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="badge">¥{b.avg}</div>
                    <div style={{marginTop:8}} className="small">发起聚会</div>
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
