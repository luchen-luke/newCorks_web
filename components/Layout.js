import Navbar from './Navbar'

export default function Layout({children}){
  return (
    <div>
      <Navbar />
      <main className="container">
        {children}
        <div className="footer">© Corks prototype — 基于 PRD 的演示 (not production)</div>
      </main>
    </div>
  )
}
