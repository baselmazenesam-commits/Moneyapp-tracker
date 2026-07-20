import { useState, useMemo } from "react";

function useStored(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const set = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, set];
}

const CATS = {
  income: ["Salary","Freelance","Business","Investment","Gift","Other"],
  expense: ["Food & Drinks","Rent","Transport","Shopping","Health","Entertainment","Utilities","Education","Other"],
};
const PLAN_CATS = ["Food & Drinks","Rent","Transport","Shopping","Health","Entertainment","Utilities","Education","Other"];
const ICONS = {
  "Salary":"💼","Freelance":"💻","Business":"🏢","Investment":"📈","Gift":"🎁",
  "Food & Drinks":"🍽️","Rent":"🏠","Transport":"🚗","Shopping":"🛍️",
  "Health":"💊","Entertainment":"🎬","Utilities":"⚡","Education":"📚","Other":"•"
};

const fmt = (n) => new Intl.NumberFormat("en-EG",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const TODAY = new Date().toISOString().split("T")[0];
const MONTH_KEY = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };
const MONTH_LABEL = () => new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});

const C = {
  bg:"#0a0a0f", surface:"#111118", border:"#1e1e30", border2:"#1a1a28",
  text:"#e8e8f0", muted:"#5a5a7a", subtle:"#8888aa",
  purple:"#6366f1", green:"#34d399", red:"#f87171", yellow:"#fbbf24",
};

const s = {
  app: { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Inter',sans-serif", paddingBottom:90 },
  header: { background:"linear-gradient(135deg,#0d0d1a,#111128)", borderBottom:`1px solid ${C.border}`, padding:"20px 16px 16px" },
  headerTitle: { fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#fff", letterSpacing:-0.5 },
  headerSub: { fontSize:11, color:C.muted, marginTop:2 },
  balCard: { background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", border:"1px solid #1e2d4a", borderRadius:20, padding:20, margin:16, position:"relative", overflow:"hidden" },
  balLabel: { fontSize:10, textTransform:"uppercase", letterSpacing:1.5, color:C.purple, fontWeight:600 },
  balAmt: { fontFamily:"'Space Grotesk',sans-serif", fontSize:34, fontWeight:700, color:"#fff", margin:"4px 0 14px", letterSpacing:-1 },
  balCurr: { fontSize:16, color:C.subtle, fontWeight:400, marginRight:4 },
  balRow: { display:"flex", gap:10 },
  balMini: { flex:1, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:10 },
  miniLabel: { fontSize:10, color:C.subtle, textTransform:"uppercase", letterSpacing:1, marginBottom:3 },
  nav: { display:"flex", gap:6, background:C.surface, borderRadius:14, padding:4, margin:"0 16px 4px" },
  navBtn: (a) => ({ flex:1, padding:"9px 2px", borderRadius:10, border:"none", fontSize:11, fontWeight:500, cursor:"pointer", background:a?"#1e1e30":"transparent", color:a?C.text:C.muted, fontFamily:"'Inter',sans-serif" }),
  pad: { padding:"0 16px" },
  st: { fontSize:11, textTransform:"uppercase", letterSpacing:1.5, color:C.muted, fontWeight:600, margin:"16px 0 8px" },
  addBtn: { width:"100%", padding:13, borderRadius:14, border:"1.5px dashed #2a2a3d", background:"transparent", color:C.purple, fontSize:13, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"'Inter',sans-serif", boxSizing:"border-box" },
  formCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:14 },
  field: { width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", color:C.text, fontSize:14, fontFamily:"'Inter',sans-serif", outline:"none", marginBottom:8, boxSizing:"border-box" },
  frow: { display:"flex", gap:8, marginBottom:8 },
  tInc: (s) => ({ flex:1, padding:9, borderRadius:10, border:`1.5px solid ${s?"#34d399":"rgba(52,211,153,0.2)"}`, fontSize:12, fontWeight:600, cursor:"pointer", background:s?"rgba(52,211,153,0.18)":"rgba(52,211,153,0.08)", color:C.green, fontFamily:"'Inter',sans-serif" }),
  tExp: (s) => ({ flex:1, padding:9, borderRadius:10, border:`1.5px solid ${s?"#f87171":"rgba(248,113,113,0.2)"}`, fontSize:12, fontWeight:600, cursor:"pointer", background:s?"rgba(248,113,113,0.18)":"rgba(248,113,113,0.08)", color:C.red, fontFamily:"'Inter',sans-serif" }),
  subInc: { width:"100%", padding:12, borderRadius:12, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", background:"linear-gradient(135deg,#059669,#34d399)", color:"#fff", fontFamily:"'Inter',sans-serif" },
  subExp: { width:"100%", padding:12, borderRadius:12, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", background:"linear-gradient(135deg,#dc2626,#f87171)", color:"#fff", fontFamily:"'Inter',sans-serif" },
  txItem: { background:C.surface, border:`1px solid ${C.border2}`, borderRadius:14, padding:12, marginBottom:8, display:"flex", alignItems:"center", gap:10 },
  txIcoInc: { width:40, height:40, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, background:"rgba(52,211,153,0.12)" },
  txIcoExp: { width:40, height:40, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, background:"rgba(248,113,113,0.12)" },
  txInfo: { flex:1, minWidth:0 },
  txDesc: { fontSize:13, fontWeight:500, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  txMeta: { fontSize:11, color:C.muted, marginTop:2 },
  txAmt: (inc) => ({ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:inc?C.green:C.red, flexShrink:0 }),
  delBtn: { background:"none", border:"none", color:"#3a3a50", cursor:"pointer", fontSize:13, padding:3, lineHeight:1 },
  empty: { textAlign:"center", padding:"30px 20px", color:"#3a3a50" },
  chip: (a) => ({ padding:"5px 11px", borderRadius:20, border:`1px solid ${a?"#6366f1":C.border}`, background:a?"#1e1e30":C.surface, color:a?C.text:C.muted, fontSize:11, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Inter',sans-serif" }),
  iCard: { background:C.surface, border:`1px solid ${C.border2}`, borderRadius:14, padding:13 },
  iLabel: { fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, marginBottom:5 },
  iVal: { fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:700, color:C.text },
  goalCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:14, marginBottom:10 },
  progBg: { height:6, background:"#1a1a28", borderRadius:3, overflow:"hidden" },
  progFill: { height:"100%", background:"linear-gradient(90deg,#6366f1,#818cf8)", borderRadius:3 },
  planSum: { background:"linear-gradient(135deg,#1a1a2e,#16213e)", border:"1px solid #1e2d4a", borderRadius:16, padding:14, marginBottom:10 },
  planBarBg: { height:7, background:"#1a1a28", borderRadius:4, overflow:"hidden", marginTop:5 },
  planItem: { background:C.surface, border:`1px solid ${C.border2}`, borderRadius:14, padding:12, marginBottom:8, display:"flex", alignItems:"center", gap:10 },
  planChk: (d) => ({ width:22, height:22, borderRadius:6, border:`1.5px solid ${d?"#34d399":"#2a2a3d"}`, background:d?"rgba(52,211,153,0.15)":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, color:C.green }),
  modal: { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 },
  modalBox: { background:"#111118", border:`1px solid ${C.border}`, borderRadius:20, padding:22, width:"100%", maxWidth:360 },
  quickBtn: { padding:"10px 14px", borderRadius:12, border:`1px solid ${C.border}`, background:C.surface, cursor:"pointer", fontFamily:"'Inter',sans-serif", textAlign:"left" },
};

function GoalAdjust({ id, onAdjust }) {
  const [val, setVal] = useState("");
  const apply = (sign) => {
    const n = parseFloat(val);
    if (!val || isNaN(n) || n <= 0) return;
    onAdjust(id, sign * n);
    setVal("");
  };
  return (
    <div style={{ display:"flex", gap:6, marginTop:10 }}>
      <input style={{ ...s.field, margin:0, flex:2 }} type="number" placeholder="Amount (EGP)" value={val} onChange={e => setVal(e.target.value)} />
      <button style={{ ...s.chip(false), color:C.green, borderColor:"rgba(52,211,153,0.3)", flex:1, textAlign:"center" }} onClick={() => apply(1)}>+ Add</button>
      <button style={{ ...s.chip(false), color:C.red, borderColor:"rgba(248,113,113,0.3)", flex:1, textAlign:"center" }} onClick={() => apply(-1)}>- Remove</button>
    </div>
  );
}

function PlanTab({ income }) {
  const [savedPlans, setSavedPlans] = useStored("fos-plans", []);
  const [activePlanId, setActivePlanId] = useStored("fos-activeplan", null);
  const [localItems, setLocalItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [planName, setPlanName] = useState("");
  const [form, setForm] = useState({ name:"", category:"Food & Drinks", amount:"" });

  const activePlan = savedPlans.find(p => p.id === activePlanId) || null;
  const items = activePlan ? activePlan.items : localItems;
  const setItems = (newItems) => {
    const ni = typeof newItems === "function" ? newItems(items) : newItems;
    if (activePlan) setSavedPlans(savedPlans.map(p => p.id === activePlanId ? { ...p, items:ni } : p));
    else setLocalItems(ni);
  };

  const total = items.reduce((s,i) => s+i.amount, 0);
  const done = items.filter(i=>i.done).reduce((s,i)=>s+i.amount,0);
  const remaining = income - total;
  const pct = income>0 ? Math.min(100,Math.round((total/income)*100)) : 0;
  const barColor = pct<70?"linear-gradient(90deg,#059669,#34d399)":pct<90?"linear-gradient(90deg,#d97706,#fbbf24)":"linear-gradient(90deg,#dc2626,#f87171)";

  const addItem = () => {
    const amt = parseFloat(form.amount);
    if (!form.name||isNaN(amt)||amt<=0) return;
    setItems([...items,{id:Date.now(),name:form.name,category:form.category,amount:amt,done:false}]);
    setForm({name:"",category:form.category,amount:""});
    setShowForm(false);
  };

  const savePlan = () => {
    if (!planName.trim()) return;
    if (activePlan) {
      setSavedPlans(savedPlans.map(p=>p.id===activePlanId?{...p,name:planName,items}:p));
    } else {
      const np = {id:Date.now(),name:planName,items};
      setSavedPlans([...savedPlans,np]);
      setActivePlanId(np.id);
      setLocalItems([]);
    }
    setShowSaveModal(false); setPlanName("");
  };

  return (
    <div style={s.pad}>
      {savedPlans.length>0 && (
        <>
          <div style={s.st}>Saved Plans</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:10,scrollbarWidth:"none"}}>
            {savedPlans.map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px 6px 12px",borderRadius:20,border:`1px solid ${p.id===activePlanId?C.purple:C.border}`,background:p.id===activePlanId?"rgba(99,102,241,0.15)":C.surface,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}
                onClick={()=>setActivePlanId(p.id)}>
                <span style={{fontSize:12,fontWeight:500,color:p.id===activePlanId?C.purple:C.text}}>{p.name}</span>
                <button style={{...s.delBtn,marginLeft:2}} onClick={e=>{e.stopPropagation();setSavedPlans(savedPlans.filter(x=>x.id!==p.id));if(activePlanId===p.id)setActivePlanId(null);}}>x</button>
              </div>
            ))}
            <button style={{...s.chip(false),flexShrink:0}} onClick={()=>{setActivePlanId(null);setLocalItems([]);}}>+ New</button>
          </div>
        </>
      )}

      <div style={s.planSum}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:items.length?12:0}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:C.text}}>{activePlan?activePlan.name:"Unsaved Plan"}</div>
            {!activePlan&&items.length>0&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>Tap Save Plan to keep it</div>}
          </div>
          <button style={{padding:"7px 13px",borderRadius:10,border:"none",background:items.length===0?"#1e1e30":"linear-gradient(135deg,#4f46e5,#6366f1)",color:items.length===0?C.muted:"#fff",fontSize:12,fontWeight:600,cursor:items.length===0?"default":"pointer",fontFamily:"'Inter',sans-serif"}}
            onClick={()=>{if(items.length>0){setPlanName(activePlan?activePlan.name:"");setShowSaveModal(true);}}}>
            {activePlan?"Update":"Save Plan"}
          </button>
        </div>
        {items.length>0&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:C.subtle}}>Monthly Income</span><span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,color:C.green}}>EGP {fmt(income)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:C.subtle}}>Planned Spending</span><span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,color:C.red}}>EGP {fmt(total)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:C.subtle}}>Left to Allocate</span><span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,color:remaining>=0?C.text:C.red}}>EGP {fmt(remaining)}</span></div>
            {income>0&&<div style={s.planBarBg}><div style={{height:"100%",borderRadius:4,background:barColor,width:`${pct}%`,transition:"width .5s"}}/></div>}
          </>
        )}
        {income===0&&<div style={{fontSize:11,color:C.muted,marginTop:items.length?10:0}}>Add income in Transactions to see budget.</div>}
      </div>

      {showSaveModal&&(
        <div style={s.modal}>
          <div style={s.modalBox}>
            <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:14}}>Name your plan</div>
            <input style={s.field} placeholder="e.g. June Budget, Tight Month..." value={planName} onChange={e=>setPlanName(e.target.value)} autoFocus />
            <div style={{display:"flex",gap:8}}>
              <button style={{...s.field,color:C.muted,cursor:"pointer",flex:1,marginBottom:0}} onClick={()=>setShowSaveModal(false)}>Cancel</button>
              <button style={{...s.subInc,flex:2}} onClick={savePlan}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={s.st}>Items - {items.length} total</div>
      {showForm&&(
        <div style={{...s.formCard,marginBottom:10}}>
          <input style={s.field} placeholder="What are you spending on?" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <select style={s.field} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            {PLAN_CATS.map(c=><option key={c}>{c}</option>)}
          </select>
          <input style={s.field} type="number" placeholder="Planned amount (EGP)" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
          <div style={s.frow}>
            <button style={{...s.field,color:C.muted,cursor:"pointer",flex:1,marginBottom:0}} onClick={()=>setShowForm(false)}>Cancel</button>
            <button style={{...s.subExp,flex:2}} onClick={addItem}>Add to Plan</button>
          </div>
        </div>
      )}
      <button style={{...s.addBtn,marginBottom:10}} onClick={()=>setShowForm(true)}>+ Plan a Spend</button>

      {items.length===0
        ?<div style={s.empty}><div style={{fontSize:32,marginBottom:8}}>🗓️</div><div style={{fontSize:13}}>No items yet</div></div>
        :items.map(item=>(
          <div key={item.id} style={s.planItem}>
            <div style={s.planChk(item.done)} onClick={()=>setItems(items.map(i=>i.id===item.id?{...i,done:!i.done}:i))}>{item.done?"✓":""}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,color:item.done?C.muted:C.text,textDecoration:item.done?"line-through":"none"}}>{item.name}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>{ICONS[item.category]||"•"} {item.category}</div>
            </div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600,color:item.done?C.muted:C.red,flexShrink:0}}>EGP {fmt(item.amount)}</div>
            <button style={s.delBtn} onClick={()=>setItems(items.filter(i=>i.id!==item.id))}>x</button>
          </div>
        ))
      }
      {items.some(i=>i.done)&&(
        <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:12,padding:"10px 14px",marginTop:4,fontSize:12,color:C.green}}>
          Done: EGP {fmt(done)} of EGP {fmt(total)} planned
        </div>
      )}
    </div>
  );
}

function QuickAddTab({ onAdd }) {
  const [shortcuts, setShortcuts] = useStored("fos-shortcuts", []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label:"", type:"expense", category:"Food & Drinks", description:"", amount:"" });
  const [justAdded, setJustAdded] = useState(null);

  const saveShortcut = () => {
    const amt = parseFloat(form.amount);
    if (!form.label||!form.description||isNaN(amt)||amt<=0) return;
    setShortcuts([...shortcuts,{...form,amount:amt,id:Date.now()}]);
    setForm({label:"",type:"expense",category:"Food & Drinks",description:"",amount:""});
    setShowForm(false);
  };

  const fire = (sc) => {
    onAdd({ type:sc.type, category:sc.category, description:sc.description, amount:sc.amount, date:TODAY });
    setJustAdded(sc.id);
    setTimeout(()=>setJustAdded(null),1200);
  };

  return (
    <div style={s.pad}>
      <div style={s.st}>Quick Add</div>
      <div style={{fontSize:12,color:C.muted,marginBottom:12}}>One tap to log your common transactions</div>

      {shortcuts.length===0&&!showForm&&(
        <div style={s.empty}>
          <div style={{fontSize:32,marginBottom:8}}>⚡</div>
          <div style={{fontSize:13}}>No shortcuts yet - create one below</div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {shortcuts.map(sc=>(
          <div key={sc.id} style={{...s.quickBtn,position:"relative",border:`1px solid ${justAdded===sc.id?"#6366f1":C.border}`,background:justAdded===sc.id?"rgba(99,102,241,0.12)":C.surface}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{fontSize:12,fontWeight:600,color:C.text,flex:1,paddingRight:4}}>{sc.label}</div>
              <button style={{...s.delBtn,fontSize:11}} onClick={()=>setShortcuts(shortcuts.filter(x=>x.id!==sc.id))}>x</button>
            </div>
            <div style={{fontSize:11,color:C.muted,margin:"2px 0 8px"}}>{sc.description}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:700,color:sc.type==="income"?C.green:C.red}}>
                {sc.type==="income"?"+":"-"}EGP {fmt(sc.amount)}
              </span>
              <button style={{padding:"5px 10px",borderRadius:8,border:"none",background:sc.type==="income"?"rgba(52,211,153,0.15)":"rgba(248,113,113,0.15)",color:sc.type==="income"?C.green:C.red,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}
                onClick={()=>fire(sc)}>
                {justAdded===sc.id?"Added!":"+ Log"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm?(
        <div style={s.formCard}>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>New Shortcut</div>
          <input style={s.field} placeholder="Button label (e.g. Petrol Fill)" value={form.label} onChange={e=>setForm({...form,label:e.target.value})}/>
          <div style={s.frow}>
            <button style={s.tInc(form.type==="income")} onClick={()=>setForm({...form,type:"income",category:"Salary"})}>Income</button>
            <button style={s.tExp(form.type==="expense")} onClick={()=>setForm({...form,type:"expense",category:"Food & Drinks"})}>Expense</button>
          </div>
          <select style={s.field} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            {CATS[form.type].map(c=><option key={c}>{c}</option>)}
          </select>
          <input style={s.field} placeholder="Description (logged on transaction)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <input style={s.field} type="number" placeholder="Default amount (EGP)" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
          <div style={{display:"flex",gap:8}}>
            <button style={{...s.field,color:C.muted,cursor:"pointer",flex:1,marginBottom:0}} onClick={()=>setShowForm(false)}>Cancel</button>
            <button style={{...s.subInc,flex:2}} onClick={saveShortcut}>Create Shortcut</button>
          </div>
        </div>
      ):(
        <button style={s.addBtn} onClick={()=>setShowForm(true)}>+ New Shortcut</button>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [txs, setTxs] = useStored("fos-txs", []);
  const [goals, setGoals] = useStored("fos-goals", []);
  const [history, setHistory] = useStored("fos-history", []);
  const [lastMonth, setLastMonth] = useStored("fos-lastmonth", "");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ type:"income", category:"Salary", description:"", amount:"", date:TODAY });
  const [goalForm, setGoalForm] = useState({ name:"", target:"", saved:"" });

  const totalIncome = useMemo(()=>txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[txs]);
  const totalExpense = useMemo(()=>txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[txs]);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome>0?Math.round(((totalIncome-totalExpense)/totalIncome)*100):0;

  const allCats = [...new Set(txs.map(t=>t.category))];
  const filtered = useMemo(()=>{
    let list=[...txs].reverse();
    if(filter==="income"||filter==="expense") return list.filter(t=>t.type===filter);
    if(filter!=="all") return list.filter(t=>t.category===filter);
    return list;
  },[txs,filter]);

  const submitTx = () => {
    const amt = parseFloat(form.amount);
    if(!form.description||isNaN(amt)||amt<=0) return;
    if(editId!==null){
      setTxs(txs.map(t=>t.id===editId?{...form,amount:amt,id:editId}:t));
      setEditId(null);
    } else {
      setTxs([...txs,{...form,amount:amt,id:Date.now()}]);
    }
    setForm({type:form.type,category:form.category,description:"",amount:"",date:TODAY});
    setShowForm(false);
  };

  const quickAdd = (tx) => setTxs(prev=>[...prev,{...tx,id:Date.now()}]);

  const deleteTx = (id)=>setTxs(txs.filter(t=>t.id!==id));
  const startEdit = (tx)=>{ setForm({type:tx.type,category:tx.category,description:tx.description,amount:String(tx.amount),date:tx.date}); setEditId(tx.id); setShowForm(true); setTab("home"); };

  const submitGoal = ()=>{
    const target=parseFloat(goalForm.target), saved=parseFloat(goalForm.saved)||0;
    if(!goalForm.name||isNaN(target)||target<=0) return;
    setGoals([...goals,{id:Date.now(),name:goalForm.name,target,saved}]);
    setGoalForm({name:"",target:"",saved:""}); setShowGoalForm(false);
  };
  const updateGoalSaved=(id,delta)=>setGoals(goals.map(g=>g.id===id?{...g,saved:Math.max(0,g.saved+delta)}:g));

  const doMonthReset = ()=>{
    const mk = MONTH_KEY();
    setHistory([...history,{ month:MONTH_LABEL(), key:mk, income:totalIncome, expense:totalExpense, balance, txCount:txs.length }]);
    setTxs([]);
    setLastMonth(mk);
    setShowResetModal(false);
  };

  const rateColor = savingsRate>=20?C.green:savingsRate>=5?C.yellow:C.red;
  const catSpend = CATS.expense.map(c=>({cat:c,val:txs.filter(t=>t.type==="expense"&&t.category===c).reduce((s,t)=>s+t.amount,0)})).filter(c=>c.val>0).slice(0,5);
  const maxSpend = Math.max(...catSpend.map(c=>c.val),1);

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet"/>

      <div style={s.header}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={s.headerTitle}>💰 FinanceOS</div>
            <div style={s.headerSub}>{MONTH_LABEL()}</div>
          </div>
          <button style={{padding:"6px 12px",borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}
            onClick={()=>setShowResetModal(true)}>
            New Month
          </button>
        </div>
      </div>

      {showResetModal&&(
        <div style={s.modal}>
          <div style={s.modalBox}>
            <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:8}}>Start New Month?</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:16,lineHeight:1.5}}>This will archive {MONTH_LABEL()} and clear all transactions. Goals and plans are kept. You can view history in the Savings tab.</div>
            <div style={{background:C.bg,borderRadius:12,padding:12,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.muted}}>Income this month</span><span style={{color:C.green,fontWeight:600}}>EGP {fmt(totalIncome)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:C.muted}}>Spent this month</span><span style={{color:C.red,fontWeight:600}}>EGP {fmt(totalExpense)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:C.muted}}>Net saved</span><span style={{color:balance>=0?C.green:C.red,fontWeight:600}}>EGP {fmt(balance)}</span></div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{...s.field,color:C.muted,cursor:"pointer",flex:1,marginBottom:0}} onClick={()=>setShowResetModal(false)}>Cancel</button>
              <button style={{...s.subInc,flex:2}} onClick={doMonthReset}>Archive & Reset</button>
            </div>
          </div>
        </div>
      )}

      <div style={s.balCard}>
        <div style={s.balLabel}>Net Balance - {MONTH_LABEL()}</div>
        <div style={s.balAmt}><span style={s.balCurr}>EGP</span>{fmt(balance)}</div>
        <div style={s.balRow}>
          <div style={s.balMini}><div style={s.miniLabel}>Income</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:600,color:C.green}}>+{fmt(totalIncome)}</div></div>
          <div style={s.balMini}><div style={s.miniLabel}>Spending</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:600,color:C.red}}>-{fmt(totalExpense)}</div></div>
          <div style={s.balMini}><div style={s.miniLabel}>Savings Rate</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:600,color:rateColor}}>{savingsRate}%</div></div>
        </div>
      </div>

      <div style={s.nav}>
        {[["home","Home"],["savings","Savings"],["plan","Plan"],["quick","Quick"]].map(([t,l])=>(
          <button key={t} style={s.navBtn(tab===t)} onClick={()=>setTab(t)}>{l}</button>
        ))}
      </div>

      {tab==="home"&&(
        <div style={s.pad}>
          {(showForm||editId!==null)?(
            <>
              <div style={s.st}>{editId?"Edit Transaction":"New Transaction"}</div>
              <div style={s.formCard}>
                <div style={s.frow}>
                  <button style={s.tInc(form.type==="income")} onClick={()=>setForm({...form,type:"income",category:"Salary"})}>Income</button>
                  <button style={s.tExp(form.type==="expense")} onClick={()=>setForm({...form,type:"expense",category:"Food & Drinks"})}>Expense</button>
                </div>
                <select style={s.field} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATS[form.type].map(c=><option key={c}>{c}</option>)}
                </select>
                <input style={s.field} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
                <input style={s.field} type="number" placeholder="Amount (EGP)" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
                <input style={s.field} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
                <div style={{display:"flex",gap:8}}>
                  <button style={{...s.field,color:C.muted,cursor:"pointer",flex:1,marginBottom:0}} onClick={()=>{setShowForm(false);setEditId(null);}}>Cancel</button>
                  <button style={{...(form.type==="income"?s.subInc:s.subExp),flex:2}} onClick={submitTx}>{editId?"Save Changes":form.type==="income"?"Add Income":"Add Expense"}</button>
                </div>
              </div>
            </>
          ):(
            <button style={{...s.addBtn,marginTop:4}} onClick={()=>{setShowForm(true);setEditId(null);}}>+ Add Transaction</button>
          )}

          {catSpend.length>0&&(
            <>
              <div style={s.st}>Monthly Overview</div>
              <div style={{...s.iCard,marginBottom:8}}>
                {/* Bar chart */}
                <div style={{display:"flex",alignItems:"flex-end",gap:4,height:55,marginBottom:4}}>
                  {catSpend.map(c=>(
                    <div key={c.cat} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:"linear-gradient(180deg,#f87171,#dc2626)",height:`${Math.max(4,(c.val/maxSpend)*50)}px`}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:4,marginBottom:14}}>
                  {catSpend.map(c=><div key={c.cat} style={{flex:1,textAlign:"center",fontSize:9,color:"#3a3a50"}}>{c.cat.split(" ")[0]}</div>)}
                </div>
                {/* Divider */}
                <div style={{height:1,background:C.border2,marginBottom:12}}/>
                {/* Category rows */}
                {CATS.expense.map(cat=>{
                  const val = txs.filter(t=>t.type==="expense"&&t.category===cat).reduce((s,t)=>s+t.amount,0);
                  if(val===0) return null;
                  const pct = totalExpense>0?Math.round((val/totalExpense)*100):0;
                  return(
                    <div key={cat} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:14}}>{ICONS[cat]||"•"}</span>
                          <span style={{fontSize:12,fontWeight:500,color:C.text}}>{cat}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:11,color:C.muted}}>{pct}%</span>
                          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:600,color:C.red}}>EGP {fmt(val)}</span>
                        </div>
                      </div>
                      <div style={{height:4,background:"#1a1a28",borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,#dc2626,#f87171)`,width:`${pct}%`,transition:"width .5s"}}/>
                      </div>
                    </div>
                  );
                })}
                {/* Income categories */}
                {CATS.income.map(cat=>{
                  const val = txs.filter(t=>t.type==="income"&&t.category===cat).reduce((s,t)=>s+t.amount,0);
                  if(val===0) return null;
                  const pct = totalIncome>0?Math.round((val/totalIncome)*100):0;
                  return(
                    <div key={cat} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:14}}>{ICONS[cat]||"•"}</span>
                          <span style={{fontSize:12,fontWeight:500,color:C.text}}>{cat}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:11,color:C.muted}}>{pct}%</span>
                          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:600,color:C.green}}>EGP {fmt(val)}</span>
                        </div>
                      </div>
                      <div style={{height:4,background:"#1a1a28",borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,#059669,#34d399)`,width:`${pct}%`,transition:"width .5s"}}/>
                      </div>
                    </div>
                  );
                })}
                {/* Total row */}
                <div style={{height:1,background:C.border2,margin:"4px 0 10px"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:C.muted,fontWeight:500}}>Total Spent</span>
                  <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:700,color:C.red}}>EGP {fmt(totalExpense)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                  <span style={{fontSize:12,color:C.muted,fontWeight:500}}>Total Income</span>
                  <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:700,color:C.green}}>EGP {fmt(totalIncome)}</span>
                </div>
              </div>
            </>
          )}

          <div style={s.st}>Transactions</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:10,scrollbarWidth:"none"}}>
            {["all","income","expense",...allCats].map(f=>(
              <button key={f} style={s.chip(filter===f)} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
          </div>

          {filtered.length===0
            ?<div style={s.empty}><div style={{fontSize:32,marginBottom:8}}>📭</div><div style={{fontSize:13}}>No transactions yet</div></div>
            :filtered.map(tx=>(
              <div key={tx.id} style={s.txItem}>
                <div style={tx.type==="income"?s.txIcoInc:s.txIcoExp}>{ICONS[tx.category]||"•"}</div>
                <div style={s.txInfo}>
                  <div style={s.txDesc}>{tx.description}</div>
                  <div style={s.txMeta}>{tx.category} - {tx.date}</div>
                </div>
                <div style={s.txAmt(tx.type==="income")}>{tx.type==="income"?"+":"-"}EGP {fmt(tx.amount)}</div>
                <button style={s.delBtn} onClick={()=>startEdit(tx)}>✏️</button>
                <button style={s.delBtn} onClick={()=>deleteTx(tx.id)}>x</button>
              </div>
            ))
          }
        </div>
      )}

      {tab==="savings"&&(
        <div style={s.pad}>
          <div style={{...s.iCard,marginBottom:10}}>
            <div style={s.iLabel}>Available to Save</div>
            <div style={{...s.iVal,fontSize:22,color:balance>=0?C.green:C.red}}>EGP {fmt(Math.max(0,balance))}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>net balance this month</div>
          </div>

          <div style={s.st}>Savings Goals</div>
          {goals.map(g=>{
            const pct=Math.min(100,Math.round((g.saved/g.target)*100));
            return(
              <div key={g.id} style={s.goalCard}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:C.text}}>{g.name}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>Target: EGP {fmt(g.target)}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:11,color:C.purple,fontWeight:600,background:"rgba(99,102,241,0.12)",padding:"2px 8px",borderRadius:20}}>{pct}%</span>
                    <button style={{...s.delBtn,fontSize:13}} onClick={()=>setGoals(goals.filter(x=>x.id!==g.id))}>x</button>
                  </div>
                </div>
                <div style={s.progBg}><div style={{...s.progFill,width:`${pct}%`}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:7,fontSize:11,color:C.muted}}>
                  <span>Saved: EGP {fmt(g.saved)}</span>
                  <span>Left: EGP {fmt(Math.max(0,g.target-g.saved))}</span>
                </div>
                <GoalAdjust id={g.id} onAdjust={updateGoalSaved}/>
              </div>
            );
          })}
          {showGoalForm?(
            <div style={s.formCard}>
              <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>New Goal</div>
              <input style={s.field} placeholder="Goal name (e.g. MatePad, Car)" value={goalForm.name} onChange={e=>setGoalForm({...goalForm,name:e.target.value})}/>
              <input style={s.field} type="number" placeholder="Target amount (EGP)" value={goalForm.target} onChange={e=>setGoalForm({...goalForm,target:e.target.value})}/>
              <input style={s.field} type="number" placeholder="Already saved (optional)" value={goalForm.saved} onChange={e=>setGoalForm({...goalForm,saved:e.target.value})}/>
              <div style={{display:"flex",gap:8}}>
                <button style={{...s.field,color:C.muted,cursor:"pointer",flex:1,marginBottom:0}} onClick={()=>setShowGoalForm(false)}>Cancel</button>
                <button style={{...s.subInc,flex:2}} onClick={submitGoal}>Create Goal</button>
              </div>
            </div>
          ):(
            <button style={s.addBtn} onClick={()=>setShowGoalForm(true)}>+ New Savings Goal</button>
          )}

          {history.length>0&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 8px"}}>
                <div style={{...s.st,margin:0}}>Monthly History</div>
                <button style={{padding:"5px 11px",borderRadius:8,border:`1px solid rgba(248,113,113,0.3)`,background:"rgba(248,113,113,0.08)",color:C.red,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}
                  onClick={()=>setHistory([])}>Clear History</button>
              </div>
              {[...history].reverse().map((h,i)=>(
                <div key={i} style={{...s.iCard,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{h.month}</div>
                    <div style={{fontSize:12,fontWeight:600,color:h.balance>=0?C.green:C.red}}>EGP {fmt(h.balance)}</div>
                  </div>
                  <div style={{display:"flex",gap:16,fontSize:11,color:C.muted}}>
                    <span>Income: <span style={{color:C.green}}>+{fmt(h.income)}</span></span>
                    <span>Spent: <span style={{color:C.red}}>-{fmt(h.expense)}</span></span>
                    <span>{h.txCount} transactions</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab==="plan"&&<PlanTab income={totalIncome}/>}
      {tab==="quick"&&<QuickAddTab onAdd={quickAdd}/>}
    </div>
  );
}
