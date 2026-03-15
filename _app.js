import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const s = {
  // NAV
  nav: { position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:64, background:'rgba(13,15,15,0.85)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.06)' },
  logo: { fontFamily:'var(--font-display)', fontSize:22, letterSpacing:3, color:'var(--accent)', display:'flex', alignItems:'center', gap:10 },
  logoBox: { width:32, height:32, background:'var(--accent)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 },
  navLinks: { display:'flex', gap:32, fontSize:13, color:'var(--muted)' },
  navLink: { cursor:'pointer', transition:'color 0.2s' },
  navCta: { display:'flex', gap:10 },
  btnOutline: { padding:'8px 20px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s' },
  btnPrimary: { padding:'8px 20px', borderRadius:8, border:'none', background:'var(--accent)', color:'#0d0f0f', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.2s' },

  // HERO
  hero: { paddingTop:160, paddingBottom:100, textAlign:'center', position:'relative', overflow:'hidden' },
  heroBadge: { display:'inline-flex', alignItems:'center', gap:8, background:'rgba(232,197,71,0.1)', border:'1px solid rgba(232,197,71,0.25)', borderRadius:100, padding:'6px 16px', fontSize:12, fontWeight:600, color:'var(--accent)', letterSpacing:1, marginBottom:32 },
  heroTitle: { fontFamily:'var(--font-display)', fontSize:'clamp(52px,8vw,96px)', letterSpacing:4, lineHeight:1, color:'var(--text)', marginBottom:24 },
  heroTitleAccent: { color:'var(--accent)' },
  heroSub: { fontSize:18, color:'var(--muted)', maxWidth:580, margin:'0 auto 40px', lineHeight:1.7 },
  heroCtas: { display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' },
  btnLg: { padding:'14px 32px', borderRadius:10, fontSize:15, fontWeight:700 },
  heroStats: { display:'flex', justifyContent:'center', gap:48, marginTop:72, flexWrap:'wrap' },
  heroStat: { textAlign:'center' },
  heroStatVal: { fontFamily:'var(--font-display)', fontSize:42, color:'var(--accent)', display:'block' },
  heroStatLbl: { fontSize:12, color:'var(--muted)', marginTop:4 },

  // SECTIONS
  section: { padding:'80px 40px', maxWidth:1200, margin:'0 auto' },
  sectionLabel: { fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:3, color:'var(--accent)', textTransform:'uppercase', marginBottom:12 },
  sectionTitle: { fontFamily:'var(--font-display)', fontSize:'clamp(32px,4vw,52px)', letterSpacing:2, marginBottom:16, color:'var(--text)' },
  sectionSub: { fontSize:16, color:'var(--muted)', maxWidth:560, lineHeight:1.7 },

  // FEATURES GRID
  featGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:20, marginTop:48 },
  featCard: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:28, transition:'all 0.3s', cursor:'default' },
  featIcon: { fontSize:28, marginBottom:16 },
  featTitle: { fontSize:16, fontWeight:700, marginBottom:8 },
  featDesc: { fontSize:13, color:'var(--muted)', lineHeight:1.6 },

  // HOW IT WORKS
  stepsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20, marginTop:48 },
  step: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:28, position:'relative' },
  stepNum: { fontFamily:'var(--font-display)', fontSize:56, color:'rgba(232,197,71,0.12)', position:'absolute', top:16, right:20, lineHeight:1 },
  stepTitle: { fontSize:15, fontWeight:700, marginBottom:8, position:'relative' },
  stepDesc: { fontSize:13, color:'var(--muted)', lineHeight:1.6, position:'relative' },

  // PRICING
  pricingGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20, marginTop:48, maxWidth:900, margin:'48px auto 0' },
  priceCard: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:32 },
  priceCardFeatured: { background:'var(--surface)', border:'1px solid rgba(232,197,71,0.4)', borderRadius:14, padding:32, position:'relative' },
  priceBadge: { position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--accent)', color:'#0d0f0f', fontSize:11, fontWeight:700, padding:'4px 16px', borderRadius:100, letterSpacing:1, whiteSpace:'nowrap' },
  priceTier: { fontSize:12, fontFamily:'var(--font-mono)', color:'var(--muted)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 },
  priceVal: { fontFamily:'var(--font-display)', fontSize:52, color:'var(--text)', letterSpacing:1 },
  pricePer: { fontSize:14, color:'var(--muted)', marginBottom:20 },
  priceFeats: { listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:28 },
  priceFeat: { fontSize:13, color:'var(--muted)', display:'flex', gap:8, alignItems:'flex-start' },
  priceFeatCheck: { color:'var(--ok)', flexShrink:0, marginTop:1 },

  // TESTIMONIALS
  testGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20, marginTop:48 },
  testCard: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:28 },
  testQuote: { fontSize:14, color:'var(--text)', lineHeight:1.7, marginBottom:20, fontStyle:'italic' },
  testAuthor: { display:'flex', alignItems:'center', gap:12 },
  testAvatar: { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 },
  testName: { fontSize:13, fontWeight:700 },
  testRole: { fontSize:11, color:'var(--muted)', marginTop:2 },

  // CTA BANNER
  ctaBanner: { background:'linear-gradient(135deg, rgba(232,197,71,0.08) 0%, rgba(78,205,196,0.08) 100%)', border:'1px solid rgba(232,197,71,0.2)', borderRadius:20, padding:'60px 40px', textAlign:'center', margin:'0 40px 80px' },
  ctaTitle: { fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,48px)', letterSpacing:2, marginBottom:16 },
  ctaSub: { fontSize:16, color:'var(--muted)', marginBottom:32, maxWidth:500, margin:'0 auto 32px' },

  // FOOTER
  footer: { borderTop:'1px solid var(--border)', padding:'40px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 },
  footerLogo: { fontFamily:'var(--font-display)', fontSize:18, letterSpacing:2, color:'var(--accent)' },
  footerLinks: { display:'flex', gap:24, fontSize:12, color:'var(--muted)' },
  footerCopy: { fontSize:12, color:'var(--muted)' },
}

const features = [
  { icon:'🏗', title:'AI Scheduling Agent', desc:'Monitors your construction schedule 24/7. Detects delays, identifies downstream impacts, and automatically reschedules affected trades.' },
  { icon:'💬', title:'Automated SMS Coordination', desc:'Sends automatic confirmations, reminders, and delay notices to every subcontractor. Contractors reply CONFIRM, DELAYED, or RESCHEDULE.' },
  { icon:'🏷', title:'Subcontractor Bidding', desc:'Blast bid requests to your entire contractor database. AI analyzes responses and recommends the best value contractor automatically.' },
  { icon:'📊', title:'Owner Reports', desc:'Auto-generates daily owner reports with progress, issues, upcoming work, and AI superintendent summary. Export to PDF in one click.' },
  { icon:'📅', title:'Gantt Schedule Tracking', desc:'Visual Gantt chart showing every task, trade, status, and progress. Color-coded alerts for delays and dependencies.' },
  { icon:'📷', title:'Jobsite Photo Feed', desc:'Attach daily site photos to the project log. AI can analyze framing progress, material deliveries, and active work areas.' },
  { icon:'👷', title:'Contractor Database', desc:'Maintain a searchable directory of all your subs with trade, rating, insurance status, service radius, and contact info.' },
  { icon:'⚡', title:'AI Recommendations', desc:'The AI superintendent panel surfaces high-priority actions daily — what to approve, follow up on, or escalate right now.' },
  { icon:'📝', title:'Daily Project Log', desc:'Quick daily site log entry with weather, crew counts, material deliveries, and issues. Feeds the AI scheduling engine.' },
]

const steps = [
  { title:'Create a Project', desc:'Enter your project name, location, budget, and target completion date. Upload your schedule or build it in the app.' },
  { title:'Add Your Contractors', desc:'Import or manually add your subcontractor database. Every contact is ready for automated SMS and bid requests.' },
  { title:'AI Takes Over', desc:'The AI superintendent monitors progress, detects delays, sends messages, and generates recommendations automatically.' },
  { title:'Close Projects Faster', desc:'Owners get daily reports. Subs get automated reminders. You save 20+ hours per week on coordination.' },
]

const pricing = [
  {
    tier:'Starter', price:'$149', per:'/month', featured:false,
    feats:['1 Active Project','Up to 25 Contractors','AI Recommendations','Automated SMS (500/mo)','Owner Reports','Email Support'],
  },
  {
    tier:'Pro', price:'$349', per:'/month', featured:true,
    feats:['5 Active Projects','Unlimited Contractors','Full AI Scheduling Agent','Automated SMS (3,000/mo)','Gantt + Bidding System','Daily Photo Log','Priority Support'],
  },
  {
    tier:'Enterprise', price:'Custom', per:'', featured:false,
    feats:['Unlimited Projects','Unlimited Contractors','White-label Option','Custom AI Training','API Access','Dedicated Account Manager','SLA Guarantee'],
  },
]

const testimonials = [
  { quote:'"We cut our weekly coordination time from 18 hours down to under 4. The automated SMS alone is worth the price — my subs actually show up now."', name:'Rick Donovan', role:'General Contractor, Milwaukee WI', initials:'RD', color:'rgba(232,197,71,0.15)', textColor:'var(--accent)' },
  { quote:'"The bidding system found me a roofer $11k cheaper than my usual guy with a better rating. Paid for a year of the software in one job."', name:'Sandra Torres', role:'Project Manager, Chicago IL', initials:'ST', color:'rgba(78,205,196,0.15)', textColor:'var(--accent2)' },
  { quote:'"My owners love the daily reports. I used to spend Sunday nights writing them manually. Now the AI does it and they look more professional than anything I made."', name:'James Whitfield', role:'Custom Home Builder, Madison WI', initials:'JW', color:'rgba(105,219,124,0.15)', textColor:'var(--ok)' },
]

export default function Home() {
  const [hoveredFeat, setHoveredFeat] = useState(null)

  return (
    <>
      <Head>
        <title>AI General Contractor – Automate Your Construction Operations</title>
        <meta name="description" content="The AI-powered construction management platform that automates scheduling, contractor coordination, bidding, and owner reporting. Replace phone calls and spreadsheets with AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="AI General Contractor" />
        <meta property="og:description" content="Automate your construction operations with AI. Schedule tracking, contractor SMS, bidding, and owner reports — all on autopilot." />
      </Head>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.logo}>
          <div style={s.logoBox}>🏗</div>
          AI GENERAL CONTRACTOR
        </div>
        <div style={s.navLinks}>
          <span style={s.navLink}>Features</span>
          <span style={s.navLink}>How It Works</span>
          <span style={s.navLink}>Pricing</span>
        </div>
        <div style={s.navCta}>
          <Link href="/dashboard">
            <button style={s.btnOutline}>View Demo</button>
          </Link>
          <Link href="/dashboard">
            <button style={s.btnPrimary}>Start Free Trial</button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={s.hero}>
        {/* Background glow */}
        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse, rgba(232,197,71,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ animation:'fadeUp 0.6s ease both' }}>
          <div style={s.heroBadge}>⚡ AI-POWERED CONSTRUCTION MANAGEMENT</div>
        </div>
        <div style={{ animation:'fadeUp 0.6s 0.1s ease both' }}>
          <h1 style={s.heroTitle}>
            YOUR JOBSITE.<br/>
            <span style={s.heroTitleAccent}>RUN BY AI.</span>
          </h1>
        </div>
        <div style={{ animation:'fadeUp 0.6s 0.2s ease both' }}>
          <p style={s.heroSub}>
            Stop spending your days on phone calls, spreadsheets, and text messages.
            AI General Contractor automates every coordination task your superintendent handles —
            so you can build more and manage less.
          </p>
        </div>
        <div style={{ ...s.heroCtas, animation:'fadeUp 0.6s 0.3s ease both' }}>
          <Link href="/dashboard">
            <button style={{ ...s.btnPrimary, ...s.btnLg }}>
              🚀 Launch Free Demo
            </button>
          </Link>
          <Link href="/dashboard">
            <button style={{ ...s.btnOutline, ...s.btnLg }}>
              See Full Dashboard →
            </button>
          </Link>
        </div>
        <div style={{ ...s.heroStats, animation:'fadeUp 0.6s 0.4s ease both' }}>
          <div style={s.heroStat}>
            <span style={s.heroStatVal}>20+</span>
            <div style={s.heroStatLbl}>Hours saved per week</div>
          </div>
          <div style={s.heroStat}>
            <span style={s.heroStatVal}>94%</span>
            <div style={s.heroStatLbl}>Subcontractor response rate</div>
          </div>
          <div style={s.heroStat}>
            <span style={s.heroStatVal}>$11k</span>
            <div style={s.heroStatLbl}>Avg savings per bid cycle</div>
          </div>
          <div style={s.heroStat}>
            <span style={s.heroStatVal}>3 min</span>
            <div style={s.heroStatLbl}>Daily owner report time</div>
          </div>
        </div>
      </div>

      {/* DASHBOARD PREVIEW STRIP */}
      <div style={{ padding:'0 40px 80px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:4, boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ background:'var(--surface2)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid var(--border)' }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff6b6b' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--warn)' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--ok)' }} />
            <div style={{ flex:1, background:'var(--bg)', borderRadius:6, padding:'4px 12px', fontSize:11, color:'var(--muted)', fontFamily:'var(--font-mono)', textAlign:'center' }}>
              aigeneralcontractor.vercel.app/dashboard
            </div>
          </div>
          <Link href="/dashboard">
            <div style={{ padding:20, cursor:'pointer' }}>
              {/* Mini dashboard preview */}
              <div style={{ display:'grid', gridTemplateColumns:'180px 1fr 200px', gap:12, height:280 }}>
                {/* Sidebar preview */}
                <div style={{ background:'var(--bg)', borderRadius:10, padding:12, display:'flex', flexDirection:'column', gap:6 }}>
                  {['Monroe Apts Ph.1','Oak Ridge Retail','Elm St. Townhomes'].map((p,i) => (
                    <div key={p} style={{ padding:'8px 10px', borderRadius:6, background:i===0?'rgba(232,197,71,0.1)':'transparent', border:i===0?'1px solid rgba(232,197,71,0.2)':'1px solid transparent', fontSize:11, color:i===0?'var(--accent)':'var(--muted)', display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:i===0?'var(--ok)':i===1?'var(--warn)':'var(--muted)' }} />
                      {p}
                    </div>
                  ))}
                  <div style={{ height:1, background:'var(--border)', margin:'4px 0' }} />
                  {['📊 Daily Report','💬 Send SMS','📋 Bid Requests'].map(item => (
                    <div key={item} style={{ padding:'7px 10px', borderRadius:6, fontSize:11, color:'var(--muted)' }}>{item}</div>
                  ))}
                </div>
                {/* Main preview */}
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ background:'linear-gradient(135deg,#141718,#1c1f20)', border:'1px solid var(--border)', borderRadius:10, padding:16, flex:1 }}>
                    <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'var(--font-mono)', letterSpacing:2, marginBottom:4 }}>ACTIVE PROJECT</div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:18, letterSpacing:1, marginBottom:8 }}>MONROE APARTMENTS PHASE 1</div>
                    <div style={{ fontSize:10, color:'var(--muted)', marginBottom:4 }}>Overall Completion</div>
                    <div style={{ background:'var(--bg)', borderRadius:100, height:6, overflow:'hidden' }}>
                      <div style={{ width:'34%', height:'100%', background:'linear-gradient(90deg,var(--accent),var(--accent2))', borderRadius:100 }} />
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginTop:10 }}>
                      {[['14','Active'],['3','Delayed'],['28','Done'],['6','Trades']].map(([v,l]) => (
                        <div key={l} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:6, padding:8, textAlign:'center' }}>
                          <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--accent)' }}>{v}</div>
                          <div style={{ fontSize:9, color:'var(--muted)' }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div style={{ background:'var(--bg)', border:'1px solid rgba(255,107,107,0.3)', borderRadius:8, padding:10, fontSize:11 }}>
                      <div style={{ color:'var(--danger)', fontWeight:600, marginBottom:4 }}>⚠ Framing Delay – Unit 3B</div>
                      <div style={{ color:'var(--muted)', fontSize:10 }}>Impacts electrical rough-in</div>
                    </div>
                    <div style={{ background:'var(--bg)', border:'1px solid rgba(105,219,124,0.3)', borderRadius:8, padding:10, fontSize:11 }}>
                      <div style={{ color:'var(--ok)', fontWeight:600, marginBottom:4 }}>✓ Foundation PASSED</div>
                      <div style={{ color:'var(--muted)', fontSize:10 }}>Engineer signed off</div>
                    </div>
                  </div>
                </div>
                {/* AI Panel preview */}
                <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, padding:12, overflow:'hidden' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:14, color:'var(--accent)', letterSpacing:1, marginBottom:10 }}>AI SUPERINTENDENT</div>
                  {[{p:'HIGH',t:'Accelerate Framing',c:'var(--danger)'},
                    {p:'HIGH',t:'Award Roofing Contract',c:'var(--danger)'},
                    {p:'MED',t:'Follow Up: Lumber',c:'var(--warn)'},
                    {p:'LOW',t:'Send Owner Update',c:'var(--ok)'}].map(r => (
                    <div key={r.t} style={{ padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                      <div style={{ fontSize:9, color:r.c, fontWeight:700, marginBottom:2 }}>{r.p}</div>
                      <div style={{ fontSize:11 }}>{r.t}</div>
                    </div>
                  ))}
                  <div style={{ marginTop:10, padding:8, background:'linear-gradient(135deg,rgba(232,197,71,0.1),rgba(78,205,196,0.1))', border:'1px solid rgba(232,197,71,0.2)', borderRadius:6, fontSize:11, color:'var(--accent)', textAlign:'center', fontWeight:700 }}>
                    ⚡ RUN AI CHECK
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'center', marginTop:12, fontSize:12, color:'var(--accent)', fontWeight:600 }}>
                Click to open live dashboard →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ ...s.section, borderTop:'1px solid var(--border)' }}>
        <div style={s.sectionLabel}>Features</div>
        <h2 style={s.sectionTitle}>Everything a GC does.<br/>Done by AI.</h2>
        <p style={s.sectionSub}>One platform replaces the phone calls, spreadsheets, and texts that eat your day.</p>
        <div style={s.featGrid}>
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{ ...s.featCard, ...(hoveredFeat===i ? { borderColor:'rgba(232,197,71,0.3)', transform:'translateY(-4px)', boxShadow:'0 20px 40px rgba(0,0,0,0.4)' } : {}) }}
              onMouseEnter={() => setHoveredFeat(i)}
              onMouseLeave={() => setHoveredFeat(null)}
            >
              <div style={s.featIcon}>{f.icon}</div>
              <div style={s.featTitle}>{f.title}</div>
              <div style={s.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ ...s.section, borderTop:'1px solid var(--border)' }}>
        <div style={s.sectionLabel}>How It Works</div>
        <h2 style={s.sectionTitle}>Up and running in 10 minutes.</h2>
        <p style={s.sectionSub}>No construction software experience needed. If you can send a text message, you can run this platform.</p>
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.title} style={s.step}>
              <div style={s.stepNum}>{i+1}</div>
              <div style={{ ...s.sectionLabel, marginBottom:8 }}>Step {i+1}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ ...s.section, borderTop:'1px solid var(--border)' }}>
        <div style={s.sectionLabel}>Testimonials</div>
        <h2 style={s.sectionTitle}>GCs love it.</h2>
        <div style={s.testGrid}>
          {testimonials.map(t => (
            <div key={t.name} style={s.testCard}>
              <div style={{ color:'var(--accent)', fontSize:24, marginBottom:12 }}>❝</div>
              <p style={s.testQuote}>{t.quote}</p>
              <div style={s.testAuthor}>
                <div style={{ ...s.testAvatar, background:t.color, color:t.textColor }}>{t.initials}</div>
                <div>
                  <div style={s.testName}>{t.name}</div>
                  <div style={s.testRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ ...s.section, borderTop:'1px solid var(--border)' }}>
        <div style={{ textAlign:'center', marginBottom:0 }}>
          <div style={s.sectionLabel}>Pricing</div>
          <h2 style={{ ...s.sectionTitle, textAlign:'center' }}>One platform.<br/>Replace three hires.</h2>
          <p style={{ ...s.sectionSub, margin:'0 auto' }}>A full-time superintendent costs $90k/yr. A project manager adds another $80k. AI GC costs less than one day of either.</p>
        </div>
        <div style={s.pricingGrid}>
          {pricing.map(p => (
            <div key={p.tier} style={p.featured ? s.priceCardFeatured : s.priceCard}>
              {p.featured && <div style={s.priceBadge}>MOST POPULAR</div>}
              <div style={s.priceTier}>{p.tier}</div>
              <div style={s.priceVal}>{p.price}</div>
              <div style={s.pricePer}>{p.per || 'contact us'}</div>
              <ul style={s.priceFeats}>
                {p.feats.map(f => (
                  <li key={f} style={s.priceFeat}>
                    <span style={s.priceFeatCheck}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <button style={{ ...(p.featured ? s.btnPrimary : s.btnOutline), width:'100%', padding:'12px', fontSize:14, borderRadius:10 }}>
                  {p.tier === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BANNER */}
      <div style={s.ctaBanner}>
        <h2 style={s.ctaTitle}>Ready to run your jobsite on autopilot?</h2>
        <p style={s.ctaSub}>Join hundreds of general contractors saving 20+ hours a week with AI coordination.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/dashboard">
            <button style={{ ...s.btnPrimary, ...s.btnLg }}>🚀 Open Live Dashboard</button>
          </Link>
          <Link href="/dashboard">
            <button style={{ ...s.btnOutline, ...s.btnLg }}>Schedule a Demo</button>
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>🏗 AI GENERAL CONTRACTOR</div>
        <div style={s.footerLinks}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
          <span>Docs</span>
        </div>
        <div style={s.footerCopy}>© 2025 AI General Contractor. All rights reserved.</div>
      </footer>
    </>
  )
}
