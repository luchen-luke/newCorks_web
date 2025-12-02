import Layout from '../../components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register(){
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [password,setPassword] = useState('')
  const r = useRouter()

  async function submit(){
    const res = await fetch('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, phone, password }) })
    const d = await res.json()
    if(res.ok) r.push('/auth/login')
    else alert(JSON.stringify(d))
  }

  return (
    <Layout>
      <h2>注册</h2>
      <div className="card">
        <input placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,marginBottom:8}} />
        <input placeholder="手机号" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,marginBottom:8}} />
        <input placeholder="密码" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,marginBottom:8}} />
        <div style={{display:'flex',justifyContent:'flex-end'}}><button className="btn" onClick={submit}>注册</button></div>
      </div>
    </Layout>
  )
}
