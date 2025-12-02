import { useEffect, useState } from 'react'

type User = { id?: string, name?: string, email?: string, phone?: string } | null

export function useAuth(){
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User>(null)

  useEffect(()=>{
    const tok = typeof window !== 'undefined' ? localStorage.getItem('corks_token') : null
    if(tok){
      setToken(tok)
      // fetch current user
      fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tok } }).then(r=>r.json()).then(d=> {
        if(d && !d.error) setUser(d)
      })
    }
  }, [])

  function login(token: string, userObj: User){
    if(typeof window !== 'undefined') localStorage.setItem('corks_token', token)
    setToken(token)
    setUser(userObj)
  }

  function logout(){
    if(typeof window !== 'undefined') localStorage.removeItem('corks_token')
    setToken(null); setUser(null)
  }

  return { token, user, login, logout }
}
