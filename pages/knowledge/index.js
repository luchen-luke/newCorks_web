import Layout from '../../components/Layout'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r=>r.json())

export default function Knowledge(){
  const { data } = useSWR('/api/knowledge', fetcher)

  return (
    <Layout>
      <h2>酒类百科</h2>
      <div className="muted">鸡尾酒 / 威士忌 / 红酒 / 精酿 — 文章和指南</div>

      <div style={{marginTop:18}}>
        {!data ? <div className="muted">加载中…</div> : (
          <div className="grid">
            {data.map(a=> (
              <div key={a.id} className="card">
                <div style={{fontWeight:800}}>{a.title}</div>
                <div className="muted small" style={{marginTop:8}}>{a.excerpt}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
