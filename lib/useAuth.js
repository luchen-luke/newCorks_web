import { useEffect, useState } from 'react'

export function useAuth(){
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const tok = localStorage.getItem('corks_token')
    if(tok){
      setToken(tok)
      // fetch current user
      fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tok } }).then(r=>r.json()).then(d=> {
        if(d && !d.error) setUser(d)
      })
    }
  }, [])

  function login(token, user){
    localStorage.setItem('corks_token', token)
    setToken(token)
    setUser(user)
  }

  function logout(){
    localStorage.removeItem('corks_token')
    setToken(null); setUser(null)
  }

  return { token, user, login, logout }
}
