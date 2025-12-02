import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar(){
  const r = useRouter()
  const links = [
    {href:'/', label:'Home'},
    {href:'/meetups', label:'聚会'},
    {href:'/bars', label:'酒吧'},
    {href:'/knowledge', label:'百科'},
    {href:'/community', label:'社区'},
    {href:'/profile', label:'我的'},
    {href:'/auth/login', label:'登录'},
    {href:'/auth/register', label:'注册'}
  ]

  return (
    <div className="nav container">
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <img src="/favicon.svg" style={{width:36,height:36,borderRadius:8}} />
        <div>
          <div style={{fontWeight:800}}>Corks</div>
          <div className="muted" style={{fontSize:11}}>酒类社交原型</div>
        </div>
      </div>

      <div style={{marginLeft:'auto',display:'flex',gap:14}}>
        {links.map(l=> (
          <Link key={l.href} href={l.href} legacyBehavior>
            <a className={r.pathname===l.href? 'active': ''}>{l.label}</a>
          </Link>
        ))}
      </div>
    </div>
  )
}
