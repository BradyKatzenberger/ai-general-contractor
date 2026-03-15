import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

// ── tiny helpers ──────────────────────────────────────────────
const c = (...cls) => cls.filter(Boolean).join(' ')

// ── data ──────────────────────────────────────────────────────
const CONTRACTORS = [
  { id:1, initials:'MJ', name:"Mike's Electric LLC",    trade:'⚡ Electrical',  phone:'(608) 555-0142', email:'mike@mikeselectric.com',  radius:'50mi', rating:4.9, insured:true,  color:'rgba(78,205,196,0.15)',  tc:'var(--accent2)' },
  { id:2, initials:'DJ', name:'Johnson Framing Inc.',   trade:'🪚 Framing',      phone:'(608) 555-0187', email:'dave@johnsonframing.com',  radius:'75mi', rating:4.2, insured:true,  color:'rgba(232,197,71,0.15)', tc:'var(--accent)' },
  { id:3, initials:'RP', name:"Rivera Plumbing Co.",    trade:'🔧 Plumbing',     phone:'(608) 555-0223', email:'carlos@riveraplumbing.com',radius:'60mi', rating:4.7, insured:true,  color:'rgba(105,219,124,0.15)',tc:'var(--ok)' },
  { id:4, initials:'SR', name:'Summit Roofing LLC',     trade:'🏠 Roofing',      phone:'(608) 555-0356', email:'tom@summitroofing.com',    radius:'100mi',rating:4.8, insured:true,  color:'rgba(255,107,107,0.15)',tc:'var(--danger)' },
  { id:5, initials:'WI', name:'Winters Insulation',     trade:'🧱 Insulation',   phone:'(608) 555-0411', email:'bill@wintersins.com',      radius:'50mi', rating:4.3, insured:true,  color:'rgba(78,205,196,0.15)', tc:'var(--accent2)' },
  { id:6, initials:'AC', name:"Anderson Concrete",      trade:'🏛 Concrete',     phone:'(608) 555-0500', email:'andy@andersonconc.com',    radius:'80mi', rating:4.6, insured:true,  color:'rgba(232,197,71,0.15)', tc:'var(--accent)' },
]

const SCHEDULE = [
  { task:'Site Prep',          trade:'GC',          pct:100, status:'done',    color:'var(--accent2)' },
  { task:'Foundation',         trade:'Concrete',    pct:100, status:'done',    color:'var(--accent2)' },
  { task:'Framing – Unit 1',   trade:'Carpenter',   pct:100, status:'done',    color:'var(--accent2)' },
  { task:'Framing – Unit 2',   trade:'Carpenter',   pct:75,  status:'on',      color:'var(--ok)' },
  { task:'Framing – Unit 3B ⚠',trade:'Carpenter',   pct:40,  status:'delay',   color:'var(--danger)' },
  { task:'MEP Rough-In',       trade:'MEP',         pct:15,  status:'waiting', color:'var(--warn)' },
  { task:'Electrical Rough',   trade:'Electrician', pct:5,   status:'waiting', color:'var(--muted)' },
  { task:'Roofing',            trade:'Roofer',      pct:0,   status:'waiting', color:'var(--muted)' },
  { task:'Insulation',         trade:'Insulation',  pct:0,   status:'pending', color:'var(--muted)' },
  { task:'Drywall',            trade:'Drywaller',   pct:0,   status:'pending', color:'var(--muted)' },
  { task:'Finish Carpentry',   trade:'Carpenter',   pct:0,   status:'pending', color:'var(--muted)' },
  { task:'Punch & CO',         trade:'GC',          pct:0,   status:'pending', color:'var(--muted)' },
]

const BIDS = [
  { name:'Summit Roofing LLC', price:'$68,400', start:'May 12', rating:'4.8', recommended:true },
  { name:'Peak Roofing Co',    price:'$71,200', start:'May 18', rating:'4.2', recommended:false },
  { name:'Apex Shield Roofing',price:'$74,900', start:'May 22', rating:'4.0', recommended:false },
]

const AI_RECS = [
  { priority:'HIGH', pcolor:'var(--danger)', title:'⚠ Accelerate Framing Unit 3B', desc:'Framing is 8 days behind. Add a second carpenter crew to recover 4 days and protect MEP rough-in start date.' },
  { priority:'HIGH', pcolor:'var(--danger)', title:'🏠 Award Roofing Contract',      desc:'Roofing start is May 12. Bid deadline today. Summit Roofing recommended at $68,400.' },
  { priority:'MED',  pcolor:'var(--warn)',   title:'📦 Follow Up: Lumber Supplier',  desc:'240 LF of 2x6 shortage confirmed. Resupply expected Friday. Confirm delivery window.' },
  { priority:'MED',  pcolor:'var(--warn)',   title:'🔔 Confirm Electrician Tomorrow',desc:"Mike's Electric confirmed Unit 2A at 7 AM. No confirmation yet for Unit 2B crew." },
  { priority:'LOW',  pcolor:'var(--ok)',     title:'📊 Send Owner Update',           desc:'Owner Sarah Chen has not received an update in 3 days. Report is ready.' },
]

const SMS_TEMPLATES = {
  confirm: `Hi [Name], please confirm your crew will arrive tomorrow at 7 AM for Monroe Apartments Phase 1. Reply CONFIRM or DELAYED.`,
  bid:     `Hi, we are requesting bids for roofing installation at Monroe Apartments, Monroe WI — est. 8,400 sqft TPO. Start: May 12. Reply BID to receive full specs.`,
  delay:   `Hi [Name], framing Unit 3B is delayed 6 days, which may shift your start date to Jun 24. Please reply CONFIRM to acknowledge the schedule update.`,
  reminder:`Hi [Name], friendly reminder your crew is scheduled for Monroe Apartments tomorrow at 7 AM. Reply CONFIRM to acknowledge or call (608) 555-0100 with questions.`,
}

// ── component ─────────────────────────────────────────────────
export default function Dashboard() {
  const [view, setView]         = useState('dashboard')
  const [aiRunning, setAiRunning] = useState(false)
  const [aiDone, setAiDone]     = useState(false)
  const [smsTo, setSmsTo]       = useState('Mike Johnson – Mike\'s Electric')
  const [smsPhone, setSmsPhone] = useState('(608) 555-0142')
  const [smsBody, setSmsBody]   = useState(SMS_TEMPLATES.confirm.replace('[Name]','Mike'))
  const [smsSent, setSmsSent]   = useState(false)
  const [selectedBid, setSelectedBid] = useState(null)
  const [logText, setLogText]   = useState('Framing crew (12 workers) active on Units 2A & 2B. Lumber delivery arrived 2:30 PM – short 240 LF of 2x6. Called supplier, resupply Friday. Electrician Mike Johnson pre-wiring in Unit 1A.')
  const [logSaved, setLogSaved] = useState(false)
  const [dismissed, setDismissed] = useState([])
  const [actioned, setActioned] = useState([])

  function runAI() {
    setAiRunning(true); setAiDone(false)
    setTimeout(() => { setAiRunning(false); setAiDone(true) }, 2200)
  }
  function sendSMS() {
    setSmsSent(true)
    setTimeout(() => setSmsSent(false), 4000)
  }
  function loadTemplate(key) {
    const name = smsTo.split(' ')[0] || 'Team'
    setSmsBody(SMS_TEMPLATES[key].replace('[Name]', name))
  }
  function composeTo(name, company, phone) {
    setSmsTo(`${name} – ${company}`)
    setSmsPhone(phone)
    setSmsBody(`Hi ${name.split(' ')[0]}, please confirm your crew will arrive tomorrow at 7 AM for Monroe Apartments Phase 1. Reply CONFIRM or DELAYED.`)
    setView('contractors')
    setTimeout(() => document.getElementById('sms-panel')?.scrollIntoView({behavior:'smooth'}), 100)
  }

  const statusBadge = (s) => {
    const map = { done:{label:'DONE',bg:'rgba(78,205,196,0.15)',color:'var(--accent2)',border:'rgba(78,205,196,0.3)'}, on:{label:'ON TRACK',bg:'rgba(105,219,124,0.15)',color:'var(--ok)',border:'rgba(105,219,124,0.3)'}, delay:{label:'DELAYED',bg:'rgba(255,107,107,0.15)',color:'var(--danger)',border:'rgba(255,107,107,0.3)'}, waiting:{label:'WAITING',bg:'rgba(255,169,77,0.15)',color:'var(--warn)',border:'rgba(255,169,77,0.3)'}, pending:{label:'PENDING',bg:'rgba(107,114,128,0.15)',color:'var(--muted)',border:'rgba(107,114,128,0.3)'} }
    const d = map[s] || map.pending
    return <span style={{fontSize:10,padding:'3px 8px',borderRadius:100,fontWeight:700,letterSpacing:.5,background:d.bg,color:d.color,border:`1px solid ${d.border}`}}>{d.label}</span>
  }

  return (
    <>
      <Head>
        <title>Dashboard – AI General Contractor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        .nav-tab{padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;color:var(--muted);transition:all .2s;border:none;background:none;}
        .nav-tab:hover{background:var(--surface2);color:var(--text);}
        .nav-tab.active{background:var(--surface2);color:var(--accent);}
        .sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;font-size:13px;color:var(--muted);transition:all .2s;border:1px solid transparent;background:none;width:100%;text-align:left;}
        .sidebar-item:hover{background:var(--surface2);color:var(--text);}
        .sidebar-item.active{background:rgba(232,197,71,.1);color:var(--accent);border-color:rgba(232,197,71,.2);}
        .feat-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;transition:all .2s;}
        .feat-card:hover{border-color:rgba(232,197,71,.3);transform:translateY(-2px);}
        .contractor-card{display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:center;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;transition:all .2s;}
        .contractor-card:hover{border-color:rgba(232,197,71,.2);}
        .btn-icon{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all .2s;font-size:13px;}
        .btn-icon:hover{border-color:var(--accent);color:var(--accent);}
        .gantt-row{display:grid;grid-template-columns:180px 90px 1fr 90px;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:12px;}
        .ai-rec{padding:14px;border-bottom:1px solid var(--border);transition:background .2s;cursor:pointer;}
        .ai-rec:hover{background:var(--surface2);}
        .btn{padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s;}
        .btn-primary{background:var(--accent);color:#0d0f0f;}
        .btn-primary:hover{background:#f5d460;transform:translateY(-1px);}
        .btn-outline{background:transparent;color:var(--text);border:1px solid var(--border);}
        .btn-outline:hover{border-color:var(--accent);color:var(--accent);}
        .btn-sm{padding:5px 10px;font-size:11px;border-radius:6px;}
        .tab{padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--muted);transition:all .2s;border:none;background:none;font-weight:500;}
        .tab.active{background:var(--surface);color:var(--text);border:1px solid var(--border);}
        .view{display:none;flex-direction:column;gap:20px;animation:fadeUp .35s ease both;}
        .view.active{display:flex;}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;}
        .progress-bar-fill::after{content:'';position:absolute;right:0;top:0;bottom:0;width:20px;background:rgba(255,255,255,.3);border-radius:100px;animation:shimmer 2s infinite;}
        .run-ai-btn{width:100%;padding:12px;background:linear-gradient(135deg,rgba(232,197,71,.15),rgba(78,205,196,.15));border:1px solid rgba(232,197,71,.3);color:var(--accent);border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:1px;transition:all .3s;}
        .run-ai-btn:hover{background:linear-gradient(135deg,rgba(232,197,71,.25),rgba(78,205,196,.25));transform:translateY(-1px);}
        .run-ai-btn:disabled{opacity:.5;cursor:default;transform:none;}
        input[type=date],select{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px;color:var(--text);}
      `}</style>

      {/* NAV */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',height:56,background:'var(--surface)',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontFamily:'var(--font-display)',fontSize:20,letterSpacing:2,color:'var(--accent)',display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:28,height:28,background:'var(--accent)',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🏗</span>
          AI GENERAL CONTRACTOR
        </Link>
        <div style={{display:'flex',gap:2}}>
          {['dashboard','schedule','contractors','reports'].map(v=>(
            <button key={v} className={`nav-tab${view===v?' active':''}`} onClick={()=>setView(v)} style={{textTransform:'capitalize'}}>{v}</button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{background:'linear-gradient(135deg,#e8c547,#4ecdc4)',padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,color:'#0d0f0f',letterSpacing:1}}>⚡ AI ACTIVE</div>
          <Link href="/"><button className="btn btn-outline btn-sm">← Back to Site</button></Link>
          <div style={{width:32,height:32,borderRadius:'50%',background:'var(--surface2)',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'var(--accent)'}}>GC</div>
        </div>
      </nav>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr 280px',height:'calc(100vh - 56px)',overflow:'hidden'}}>

        {/* SIDEBAR */}
        <div style={{background:'var(--surface)',borderRight:'1px solid var(--border)',padding:'20px 12px',overflowY:'auto',display:'flex',flexDirection:'column',gap:6}}>
          <div style={{fontSize:10,letterSpacing:2,color:'var(--muted)',textTransform:'uppercase',padding:'8px 8px 4px',fontFamily:'var(--font-mono)'}}>Projects</div>
          {[{name:'Monroe Apts Ph.1',color:'var(--ok)'},{name:'Oak Ridge Retail',color:'var(--warn)'},{name:'Elm St. Townhomes',color:'var(--muted)'}].map((p,i)=>(
            <button key={p.name} className={`sidebar-item${i===0?' active':''}`}>
              <div style={{width:8,height:8,borderRadius:'50%',background:p.color,flexShrink:0}}/>
              <span>{p.name}</span>
            </button>
          ))}
          <div style={{fontSize:10,letterSpacing:2,color:'var(--muted)',textTransform:'uppercase',padding:'12px 8px 4px',fontFamily:'var(--font-mono)'}}>Quick Actions</div>
          {[{icon:'📊',label:'Daily Report',v:'reports'},{icon:'💬',label:'Send SMS',v:'contractors'},{icon:'📋',label:'Bid Requests',v:'schedule'},{icon:'👷',label:'Contractors',v:'contractors'}].map(item=>(
            <button key={item.label} className="sidebar-item" onClick={()=>setView(item.v)}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
          <div style={{marginTop:'auto',padding:'12px 8px',borderTop:'1px solid var(--border)'}}>
            <div style={{fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>v1.0.0 MVP</div>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>AI Model: Active</div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{overflowY:'auto',padding:24}}>

          {/* ── DASHBOARD VIEW ── */}
          <div className={`view${view==='dashboard'?' active':''}`}>
            {/* Project hero */}
            <div style={{background:'linear-gradient(135deg,#141718,#1c1f20)',border:'1px solid var(--border)',borderRadius:12,padding:24,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-40,right:-40,width:220,height:220,background:'radial-gradient(circle,rgba(232,197,71,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
              <div style={{fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:2,marginBottom:6}}>ACTIVE PROJECT</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:28,letterSpacing:2}}>MONROE APARTMENTS PHASE 1</div>
              <div style={{display:'flex',gap:20,marginTop:8,flexWrap:'wrap'}}>
                {[['📍','Monroe, WI'],['📅','Start: Mar 1, 2025'],['🎯','Target: Sep 15, 2025'],['💰','$4.2M budget']].map(([ic,v])=>(
                  <div key={v} style={{fontSize:12,color:'var(--muted)',display:'flex',alignItems:'center',gap:5}}>{ic} <span style={{color:'var(--text)',fontWeight:500}}>{v}</span></div>
                ))}
              </div>
              <div style={{marginTop:20}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
                  <span style={{fontWeight:500}}>Overall Completion</span>
                  <span style={{fontFamily:'var(--font-display)',fontSize:22,color:'var(--accent)'}}>34%</span>
                </div>
                <div style={{background:'var(--bg)',borderRadius:100,height:10,overflow:'hidden'}}>
                  <div className="progress-bar-fill" style={{width:'34%',height:'100%',borderRadius:100,background:'linear-gradient(90deg,var(--accent),var(--accent2))',position:'relative'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:11,color:'var(--muted)'}}>
                  <span>Day 107 of 198</span>
                  <span style={{color:'var(--warn)'}}>⚠ 8 days behind schedule</span>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop:20}}>
                {[['14','Active Tasks','var(--accent)'],['3','Delayed','var(--danger)'],['28','Completed','var(--ok)'],['6','Trades On Site','var(--accent2)']].map(([v,l,color])=>(
                  <div key={l} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:10,padding:14,textAlign:'center'}}>
                    <div style={{fontFamily:'var(--font-display)',fontSize:28,color}}>{v}</div>
                    <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts + Weather */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="card">
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                  <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>⚠ Active Alerts</div>
                  <span style={{fontSize:10,padding:'3px 8px',borderRadius:100,background:'rgba(255,107,107,.15)',color:'var(--danger)',border:'1px solid rgba(255,107,107,.3)',fontWeight:700}}>3 CRITICAL</span>
                </div>
                {[{type:'danger',title:'Framing Delay – Unit 3B',sub:'6h ago — Impacts electrical rough-in start'},{type:'warn',title:'Lumber delivery delayed 2 days',sub:'1h ago — New ETA: Friday'},{type:'ok',title:'Foundation inspection PASSED',sub:'Yesterday — Engineer signed off'}].map(a=>(
                  <div key={a.title} style={{display:'flex',alignItems:'flex-start',gap:10,padding:10,borderRadius:8,marginBottom:8,background:a.type==='danger'?'rgba(255,107,107,.07)':a.type==='warn'?'rgba(255,169,77,.07)':'rgba(105,219,124,.07)',border:`1px solid ${a.type==='danger'?'rgba(255,107,107,.2)':a.type==='warn'?'rgba(255,169,77,.2)':'rgba(105,219,124,.2)'}`}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:a.type==='danger'?'var(--danger)':a.type==='warn'?'var(--warn)':'var(--ok)',marginTop:4,flexShrink:0}}/>
                    <div><strong style={{fontSize:13}}>{a.title}</strong><div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{a.sub}</div></div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase',marginBottom:16}}>🌤 Jobsite Weather</div>
                <div style={{display:'flex',alignItems:'center',gap:16,padding:16,background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10}}>
                  <div style={{fontSize:36}}>⛅</div>
                  <div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:40}}>58°F</div>
                    <div style={{fontSize:14,fontWeight:500}}>Partly Cloudy</div>
                    <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>Monroe, WI · Wind: 9 mph NW · Humidity: 62%</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginTop:12}}>
                  {[['Mon','🌧','51°'],['Tue','🌤','62°'],['Wed','☀️','67°'],['Thu','⛅','60°'],['Fri','🌧','54°']].map(([d,ic,t],i)=>(
                    <div key={d} style={{textAlign:'center',fontSize:11}}>
                      <div style={{color:i===2?'var(--accent)':'inherit'}}>{d}</div>
                      <div style={{fontSize:18}}>{ic}</div>
                      <div style={{color:i===2?'var(--accent)':'var(--muted)'}}>{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Jobsite Feed */}
            <div className="card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>📷 Jobsite Feed</div>
                <button className="btn btn-outline btn-sm">+ Upload Photo</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {[{bg:'linear-gradient(135deg,#1c2a1c,#2a3a2a)',icon:'🏗',label:'Unit 2A – Framing',tag:'TODAY 7:42 AM'},
                  {bg:'linear-gradient(135deg,#1c1c2a,#2a2a3a)',icon:'🧱',label:'North Wall – Block Work',tag:'TODAY 9:15 AM'},
                  {bg:'linear-gradient(135deg,#2a1c1c,#3a2a2a)',icon:'🚛',label:'Material Delivery – Lumber',tag:'YST 3:20 PM'},
                  {bg:'linear-gradient(135deg,#1c2a2a,#2a3a3a)',icon:'🔧',label:'Plumbing Rough-In B1',tag:'YST 10:05 AM'},
                  {bg:'linear-gradient(135deg,#2a2a1c,#3a3a2a)',icon:'⚡',label:'Electrical Panel Install',tag:'MON 2:30 PM'},
                  {bg:'linear-gradient(135deg,#1c1c1c,#2a2a2a)',icon:'📡',label:'Connect Live Camera',tag:'+ ADD FEED'},
                ].map(p=>(
                  <div key={p.label} style={{background:p.bg,borderRadius:10,overflow:'hidden',position:'relative',aspectRatio:'16/10',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid var(--border)',cursor:'pointer'}}>
                    <div style={{fontSize:28,opacity:.35}}>{p.icon}</div>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.8))',padding:'16px 8px 6px',fontSize:11,color:'white'}}>{p.label}</div>
                    <div style={{position:'absolute',top:6,left:6,background:'rgba(0,0,0,.6)',fontSize:9,padding:'2px 6px',borderRadius:4,color:'var(--accent)',fontFamily:'var(--font-mono)'}}>{p.tag}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule preview */}
            <div className="card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>📅 Schedule Overview</div>
                <button className="btn btn-outline btn-sm" onClick={()=>setView('schedule')}>View Full Schedule →</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'180px 80px 1fr 90px',gap:8,alignItems:'center',padding:'8px 0',fontSize:10,letterSpacing:1,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>
                <div>Task</div><div>Trade</div><div>Progress</div><div>Status</div>
              </div>
              {SCHEDULE.slice(0,6).map(row=>(
                <div key={row.task} className="gantt-row">
                  <div>{row.task}</div>
                  <div style={{color:'var(--muted)',fontSize:11}}>{row.trade}</div>
                  <div style={{background:'var(--bg)',borderRadius:4,height:18,overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:4,background:row.color,width:`${row.pct||2}%`}}/>
                  </div>
                  <div>{statusBadge(row.status)}</div>
                </div>
              ))}
            </div>

            {/* Recent SMS */}
            <div className="card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>💬 Recent Automated Messages</div>
                <button className="btn btn-outline btn-sm" onClick={()=>setView('contractors')}>Send New →</button>
              </div>
              {[{to:"→ Mike's Electric (Mike Johnson)",time:'TODAY 6:00 AM',msg:"Hi Mike, please confirm your electrical crew will arrive tomorrow at 7 AM for Monroe Apartments Phase 1. Reply CONFIRM.",tags:[{label:'✓ CONFIRMED',color:'var(--ok)',bg:'rgba(105,219,124,.1)'},{label:'SMS SENT',color:'var(--accent2)',bg:'rgba(78,205,196,.1)'}]},
                {to:'→ Johnson Framing (Dave Johnson)',time:'YST 4:30 PM',msg:"Hi Dave, framing on Unit 3B is delayed. Please provide an updated completion estimate. Your delay impacts MEP rough-in.",tags:[{label:'⏳ AWAITING REPLY',color:'var(--warn)',bg:'rgba(255,169,77,.1)'},{label:'SMS SENT',color:'var(--accent2)',bg:'rgba(78,205,196,.1)'}]},
                {to:'→ 4 Roofing Contractors (Bid Request)',time:'YST 9:00 AM',msg:"Hi, we are requesting bids for roofing installation at Monroe Apartments, Monroe WI. Est. 8,400 sqft TPO. Start: May 12. Reply BID to receive specs.",tags:[{label:'4 SENT',color:'var(--accent2)',bg:'rgba(78,205,196,.1)'},{label:'2 RESPONSES',color:'var(--accent)',bg:'rgba(232,197,71,.1)'}]},
              ].map(m=>(
                <div key={m.to} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:12,marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:12,fontWeight:600,color:'var(--accent2)'}}>{m.to}</span>
                    <span style={{fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>{m.time}</span>
                  </div>
                  <div style={{fontSize:12,color:'var(--text)',lineHeight:1.5,marginBottom:8}}>{m.msg}</div>
                  <div style={{display:'flex',gap:6}}>
                    {m.tags.map(t=><span key={t.label} style={{fontSize:10,padding:'2px 8px',borderRadius:4,color:t.color,background:t.bg}}>{t.label}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SCHEDULE VIEW ── */}
          <div className={`view${view==='schedule'?' active':''}`}>
            <div className="card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>📅 Construction Schedule</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'180px 90px 1fr 90px',gap:8,padding:'8px 0',fontSize:10,letterSpacing:1,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase',borderBottom:'1px solid var(--border)'}}>
                <div>Task Name</div><div>Trade</div><div>Progress</div><div>Status</div>
              </div>
              {SCHEDULE.map(row=>(
                <div key={row.task} className="gantt-row" style={row.status==='delay'?{background:'rgba(255,107,107,.03)'}:{}}>
                  <div style={{fontWeight:row.status==='delay'?700:400}}>{row.task}</div>
                  <div style={{color:'var(--muted)',fontSize:11}}>{row.trade}</div>
                  <div style={{background:'var(--bg)',borderRadius:4,height:20,overflow:'hidden',position:'relative'}}>
                    <div style={{height:'100%',borderRadius:4,background:row.color,width:`${Math.max(row.pct,row.pct>0?3:0)}%`}}/>
                    {row.pct>0&&<div style={{position:'absolute',right:4,top:'50%',transform:'translateY(-50%)',fontSize:9,color:'rgba(255,255,255,.6)',fontFamily:'var(--font-mono)'}}>{row.pct}%</div>}
                  </div>
                  <div>{statusBadge(row.status)}</div>
                </div>
              ))}
            </div>

            {/* Bidding */}
            <div className="card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>🏷 Subcontractor Bids – Roofing</div>
                <button className="btn btn-primary btn-sm" onClick={()=>alert('Bid requests sent to 4 roofing contractors via SMS!\n\nSent to:\n• Summit Roofing LLC\n• Peak Roofing Co\n• Apex Shield Roofing\n• Midwest Roofing Pros')}>📤 Send Bid Requests</button>
              </div>
              <div style={{background:'rgba(255,169,77,.06)',border:'1px solid rgba(255,169,77,.2)',borderRadius:8,padding:12,marginBottom:16,fontSize:12}}>
                <strong style={{color:'var(--warn)'}}>⚡ AI BID ANALYSIS:</strong> Based on 3 responses, Summit Roofing offers the best value — $2,100 below average with a strong 4.8★ rating and earliest start date.
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 60px 90px',gap:8,padding:'8px 12px',background:'var(--bg)',borderRadius:'8px 8px 0 0',fontSize:10,letterSpacing:1,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>
                <div>Contractor</div><div>Price</div><div>Start</div><div>Rating</div><div>Action</div>
              </div>
              {BIDS.map((b,i)=>(
                <div key={b.name} style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 60px 90px',gap:8,alignItems:'center',padding:'10px 12px',borderRadius:b.recommended?8:0,fontSize:12,background:b.recommended?'rgba(105,219,124,.05)':'',border:b.recommended?'1px solid rgba(105,219,124,.15)':'',marginBottom:b.recommended?8:0}}>
                  <div><strong>{b.name}</strong>{b.recommended&&<div style={{fontSize:10,color:'var(--ok)'}}>⭐ AI RECOMMENDED</div>}</div>
                  <div style={{color:'var(--ok)',fontWeight:600,fontFamily:'var(--font-mono)'}}>{b.price}</div>
                  <div style={{fontSize:11,color:'var(--muted)'}}>{b.start}</div>
                  <div style={{color:'var(--accent)',fontSize:11}}>★ {b.rating}</div>
                  <div>
                    <button
                      onClick={()=>{setSelectedBid(b.name);alert(`🎉 ${b.name} awarded the roofing contract!\n\nAI is generating contract confirmation SMS...`)}}
                      style={{padding:'4px 10px',background:selectedBid===b.name?'var(--ok)':'var(--ok)',color:'#0d0f0f',border:'none',borderRadius:5,fontSize:10,fontWeight:700,cursor:'pointer',opacity:selectedBid&&selectedBid!==b.name?.4:1}}
                    >{selectedBid===b.name?'✓ AWARDED':'SELECT'}</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Log */}
            <div className="card">
              <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase',marginBottom:16}}>📝 Daily Project Log</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                <div><div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Date</div>
                  <input type="date" defaultValue="2025-06-15"/></div>
                <div><div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Weather</div>
                  <select><option>☀️ Sunny – 65°F</option><option>⛅ Partly Cloudy</option><option>🌧 Rain – Work Suspended</option></select></div>
              </div>
              <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Site Notes</div>
              <textarea value={logText} onChange={e=>setLogText(e.target.value)} rows={4} style={{width:'100%',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:8,padding:12,color:'var(--text)',resize:'none',lineHeight:1.6,fontSize:13,marginBottom:12}}/>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <button className="btn btn-primary" onClick={()=>{setLogSaved(true);setTimeout(()=>setLogSaved(false),3000)}}>Save Log</button>
                <button className="btn btn-outline">+ Add Photos</button>
                <button className="btn btn-outline" onClick={()=>setView('reports')}>Generate Report</button>
                {logSaved&&<span style={{fontSize:12,color:'var(--ok)'}}>✓ Log saved!</span>}
              </div>
            </div>
          </div>

          {/* ── CONTRACTORS VIEW ── */}
          <div className={`view${view==='contractors'?' active':''}`}>
            <div className="card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>👷 Contractor Directory</div>
                <div style={{display:'flex',gap:8}}>
                  <input type="text" placeholder="Search contractors..." style={{width:180}}/>
                  <button className="btn btn-primary btn-sm">+ Add Contractor</button>
                </div>
              </div>
              {CONTRACTORS.map(con=>(
                <div key={con.id} className="contractor-card">
                  <div style={{width:40,height:40,borderRadius:8,background:con.color,color:con.tc,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:16,fontWeight:700}}>{con.initials}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{con.name}</div>
                    <div style={{fontSize:11,color:'var(--muted)'}}>{con.trade} · {'★'.repeat(Math.floor(con.rating))}{'☆'.repeat(5-Math.floor(con.rating))} {con.rating} · {con.insured?'Insured ✓':'⚠ Verify Insurance'}</div>
                    <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{con.phone} · {con.radius} radius</div>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <div className="btn-icon" title="Call" onClick={()=>alert(`Calling ${con.name} at ${con.phone}...`)}>📞</div>
                    <div className="btn-icon" title="SMS" onClick={()=>composeTo(con.name.split(' ').slice(0,2).join(' '), con.name, con.phone)}>💬</div>
                    <div className="btn-icon" title="Email" onClick={()=>alert(`Opening email to ${con.email}`)}>✉️</div>
                    <div className="btn-icon" title="Request Bid" onClick={()=>{setSmsBody(SMS_TEMPLATES.bid);document.getElementById('sms-panel')?.scrollIntoView({behavior:'smooth'})}}>💰</div>
                  </div>
                </div>
              ))}
            </div>

            {/* SMS Compose */}
            <div className="card" id="sms-panel">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>💬 Compose SMS</div>
                <div style={{display:'flex',gap:4,background:'var(--bg)',padding:4,borderRadius:8,border:'1px solid var(--border)'}}>
                  {[['confirm','Confirmation'],['bid','Bid Request'],['delay','Delay Notice'],['reminder','Reminder']].map(([key,label])=>(
                    <button key={key} className="tab" onClick={()=>loadTemplate(key)}>{label}</button>
                  ))}
                </div>
              </div>
              <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:10,padding:16}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>To</div>
                    <input value={smsTo} onChange={e=>setSmsTo(e.target.value)} style={{width:'100%'}}/></div>
                  <div><div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Phone</div>
                    <input value={smsPhone} onChange={e=>setSmsPhone(e.target.value)} style={{width:'100%'}}/></div>
                </div>
                <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Message ({smsBody.length} chars)</div>
                <textarea value={smsBody} onChange={e=>setSmsBody(e.target.value)} rows={4} style={{width:'100%',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,padding:12,color:'var(--text)',resize:'none',fontSize:13,lineHeight:1.6,marginBottom:12}}/>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <button className="btn btn-primary" onClick={sendSMS}>📤 Send SMS</button>
                  <button className="btn btn-outline">Schedule Send</button>
                  <span style={{fontSize:11,color:'var(--muted)',marginLeft:'auto'}}>Via Twilio API</span>
                </div>
                {smsSent&&<div style={{marginTop:12,padding:12,background:'rgba(105,219,124,.08)',border:'1px solid rgba(105,219,124,.2)',borderRadius:8,fontSize:13,color:'var(--ok)'}}>✓ Message sent successfully via Twilio! Awaiting contractor reply.</div>}
              </div>
            </div>
          </div>

          {/* ── REPORTS VIEW ── */}
          <div className={`view${view==='reports'?' active':''}`}>
            <div className="card">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>📊 Owner Report – June 15, 2025</div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn btn-outline btn-sm">← Prev</button>
                  <button className="btn btn-outline btn-sm">Next →</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>alert('PDF generation requires a backend service.\n\nIn production: install "puppeteer" or "pdf-lib" on your Railway backend to auto-generate branded PDFs and email them to your owner.')}>⬇ Export PDF</button>
                </div>
              </div>
              <div style={{background:'linear-gradient(135deg,rgba(232,197,71,.05),rgba(78,205,196,.05))',border:'1px solid rgba(232,197,71,.15)',borderRadius:10,padding:16,marginBottom:20}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:20,letterSpacing:1}}>MONROE APARTMENTS PHASE 1</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>Owner Daily Report · Generated by AI General Contractor</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:13,fontWeight:600}}>Sunday, June 15, 2025</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>Day 107 of 198</div>
                  </div>
                </div>
              </div>
              {[
                {title:'📋 Work Completed Today', items:['Framing Units 2A & 2B progressed to 75% completion (8 workers, 9 hrs)','Electrical pre-wiring complete in Unit 1A (Mike\'s Electric – 3 workers)','Lumber delivery received (partial – 240 LF 2x6 short, ETA Friday)','Plumbing DWV inspected and approved in Building B1']},
                {title:'📈 Current Project Status', items:['Overall completion: 34% (target was 38% by today)','Project is 8 calendar days behind schedule','Budget utilization: $1.47M of $4.2M (35.0%)']},
                {title:'⚠ Issues & Delays', items:['FRAMING DELAY: Unit 3B framing 40% complete vs. required 80%. Impact: MEP rough-in pushed 6 days.','MATERIAL SHORTAGE: 240 LF of 2x6 lumber pending delivery (supplier notified)','ROOFING BID: Award pending — 2 of 4 bids received. Deadline: tomorrow 5 PM']},
                {title:'📅 Upcoming Work (Next 7 Days)', items:['Mon Jun 16: Foundation inspection w/ engineer, 9 AM','Tue–Wed: Complete framing Units 3A–3C (accelerated crew)','Wed Jun 18: MEP rough-in begins, Buildings A & B','Fri Jun 20: Lumber resupply delivery, roofing award announcement']},
              ].map(section=>(
                <div key={section.title} style={{padding:'16px 0',borderBottom:'1px solid var(--border)'}}>
                  <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',marginBottom:10}}>{section.title}</div>
                  {section.items.map(item=>(
                    <div key={item} style={{display:'flex',gap:8,fontSize:13,padding:'4px 0'}}>
                      <span style={{color:'var(--accent)',flexShrink:0}}>▸</span>{item}
                    </div>
                  ))}
                </div>
              ))}
              <div style={{padding:'16px 0'}}>
                <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',marginBottom:10}}>💬 AI Superintendent Summary</div>
                <div style={{fontSize:13,color:'var(--text)',lineHeight:1.7,padding:12,background:'var(--bg)',borderRadius:8,borderLeft:'3px solid var(--accent)'}}>
                  The project is progressing at 34% completion with schedule pressure from the framing delay. The primary risk is Unit 3B — if resolved this week, the MEP sequence stays intact. I recommend approving an accelerated framing crew to recover 4 of the 8 lost days. Roofing bid selection should occur by tomorrow to maintain the May 12 start date. No safety incidents reported today. Overall project health: <strong style={{color:'var(--warn)'}}>YELLOW – MONITOR</strong>.
                </div>
              </div>
            </div>

            {/* Progress chart */}
            <div className="card">
              <div style={{fontSize:11,letterSpacing:2,color:'var(--muted)',fontFamily:'var(--font-mono)',textTransform:'uppercase',marginBottom:20}}>📈 Progress Trend (Last 14 Days)</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:5,height:80}}>
                {[40,45,48,52,55,58,60,62,65,68,70,72,75,100].map((h,i)=>(
                  <div key={i} style={{flex:1,height:`${h}%`,background:i===13?'var(--accent)':'rgba(232,197,71,.3)',borderRadius:'3px 3px 0 0',position:'relative',transition:'all .3s'}}>
                    {i===13&&<div style={{position:'absolute',top:-20,left:'50%',transform:'translateX(-50%)',fontSize:10,color:'var(--accent)',fontFamily:'var(--font-mono)',whiteSpace:'nowrap'}}>34%</div>}
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',marginTop:6}}>
                <span>Jun 1</span><span>Jun 8</span><span>TODAY</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:16}}>
                {[['Avg daily progress','+0.31%','var(--ok)'],['Projected finish','Sep 23','var(--warn)'],['Schedule variance','-8 days','var(--danger)']].map(([l,v,color])=>(
                  <div key={l} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:14}}>
                    <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>{l}</div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:24,color}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL – AI */}
        <div style={{background:'var(--surface)',borderLeft:'1px solid var(--border)',overflowY:'auto',display:'flex',flexDirection:'column'}}>
          <div style={{padding:20,borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:18,letterSpacing:1,color:'var(--accent)'}}>AI SUPERINTENDENT</div>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:4,fontFamily:'var(--font-mono)'}}>
              {aiRunning?'🔄 Analyzing project...':`Last analysis: ${aiDone?'just now':'6 min ago'}`}
            </div>
          </div>

          <div style={{margin:16}}>
            <button className="run-ai-btn" disabled={aiRunning} onClick={runAI}>
              {aiRunning?'⏳ ANALYZING...':'⚡ RUN AI CHECK'}
            </button>
            {aiDone&&<div style={{marginTop:8,padding:10,background:'rgba(105,219,124,.08)',border:'1px solid rgba(105,219,124,.2)',borderRadius:8,fontSize:11,color:'var(--ok)'}}>
              ✓ Analysis complete. 5 recommendations updated.
            </div>}
          </div>

          <div>
            {AI_RECS.map((rec,i)=>(
              !dismissed.includes(i) &&
              <div key={rec.title} className="ai-rec">
                <div style={{fontSize:10,fontWeight:700,letterSpacing:1,padding:'2px 8px',borderRadius:4,display:'inline-block',marginBottom:6,background:rec.priority==='HIGH'?'rgba(255,107,107,.2)':rec.priority==='MED'?'rgba(255,169,77,.2)':'rgba(105,219,124,.2)',color:rec.pcolor}}>{rec.priority}</div>
                <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{rec.title}</div>
                <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.5,marginBottom:10}}>{rec.desc}</div>
                <div style={{display:'flex',gap:6}}>
                  {!actioned.includes(i)
                    ? <button className="btn btn-primary btn-sm" onClick={()=>setActioned(a=>[...a,i])}>Take Action</button>
                    : <span style={{fontSize:11,color:'var(--ok)',fontWeight:600}}>✓ Action logged</span>
                  }
                  <button className="btn btn-outline btn-sm" onClick={()=>setDismissed(d=>[...d,i])}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:16,borderTop:'1px solid var(--border)',marginTop:8}}>
            <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',marginBottom:8,letterSpacing:1}}>QUICK STATS</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['92%','AI Accuracy','var(--ok)'],['47','SMS Sent','var(--accent2)'],['12','Bids Collected','var(--accent)'],['3','Open Alerts','var(--danger)']].map(([v,l,color])=>(
                <div key={l} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,padding:12,textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:22,color}}>{v}</div>
                  <div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
