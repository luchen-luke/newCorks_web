import Layout from '../../components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../lib/useAuth'

export default function Login(){
  const [identifier,setIdentifier] = useState('')
  const [password,setPassword] = useState('')
  const auth = useAuth()
  const r = useRouter()

  async function submit(){
    const res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ identifier, password }) })
    const d = await res.json()
    if(res.ok){
      auth.login(d.token, d.user)
      r.push('/')
    }else{
      alert(JSON.stringify(d))
    }
  }

  return (
    <Layout>
      <h2>登录</h2>
      <div className="card">
        <input placeholder="邮箱或手机号" value={identifier} onChange={e=>setIdentifier(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,marginBottom:8}} />
        <input placeholder="密码" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,marginBottom:8}} />
        <div style={{display:'flex',justifyContent:'flex-end'}}><button className="btn" onClick={submit}>登录</button></div>
      </div>
    </Layout>
  )
}
