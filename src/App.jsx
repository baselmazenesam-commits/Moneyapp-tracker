import { useState, useMemo } from "react";

function useStored(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const [ready] = useState(true);
  const set = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, set, ready];
}

const CATS = {
  income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"],
  expense: ["Food & Drinks", "Rent", "Transport", "Shopping", "Health", "Entertainment", "Utilities", "Education", "Other"],
};
const PLAN_CATS = ["Food & Drinks", "Rent", "Transport", "Shopping", "Health", "Entertainment", "Utilities", "Education", "Other"];

const ICONS = {
  "Salary":"💼","Freelance":"💻","Business":"🏢","Investment":"📈","Gift":"🎁",
  "Food & Drinks":"🍽️","Rent":"🏠","Transport":"🚗","Shopping":"🛍️",
  "Health":"💊","Entertainment":"🎬","Utilities":"⚡","Education":"📚","Other":"•"
};

const fmt = (n) => new Intl.NumberFormat("en-EG",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const TODAY = new Date().toISOString().split("T")[0];

const C = {
  bg: "#0a0a0f", surface: "#111118", border: "#1e1e30", border2: "#1a1a28",
  text: "#e8e8f0", muted: "#5a5a7a", subtle: "#8888aa",
  purple: "#6366f1", green: "#34d399", red: "#f87171", yellow: "#fbbf24",
  cardBg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
};

const s = {
  app: { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Inter',sans-serif", paddingBottom:80 },
  header: { background:"linear-gradient(135deg,#0d0d1a,#111128)", borderBottom:`1px solid ${C.border}`, padding:"24px 20px 20px" },
  headerTitle: { fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700, color:"#fff", letterSpacing:-0.5 },
  headerSub: { fontSize:12, color:C.muted, marginTop:2 },
  balCard: { background:C.cardBg, border:"1px solid #1e2d4a", borderRadius:20, padding:24, margin:16, position:"relative", overflow:"hidden" },
  balLabel: { fontSize:11, textTransform:"uppercase", letterSpacing:1.5, color:C.purple, fontWeight:600 },
  balAmt: { fontFamily:"'Space Grotesk',sans-serif", fontSize:38, fontWeight:700, color:"#fff", margin:"6px 0 16px", letterSpacing:-1 },
  balCurr: { fontSize:18, color:C.subtle, fontWeight:400, marginRight:4 },
  balRow: { display:"flex", gap:12 },
  balMini: { flex:1, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:12 },
  miniLabel: { fontSize:10, color:C.subtle, textTransform:"uppercase", letterSpacing:1, marginBottom:4 },
  nav: { display:"flex", gap:8, background:C.surface, borderRadius:14, padding:4, margin:16 },
  navBtn: (active) => ({ flex:1, padding:"9px 4px", borderRadius:10, border:"none", fontSize:12, fontWeight:500, cursor:"pointer", background: active?"#1e1e30":"transparent", color: active?C.text:C.muted, fontFamily:"'Inter',sans-serif", transition:"all .2s" }),
  pad: { padding:"0 16px" },
  sectionTitle: { fontSize:11, textTransform:"uppercase", letterSpacing:1.5, color:C.muted, fontWeight:600, margin:"20px 0 10px" },
  addBtn: { width:"100%", padding:14, borderRadius:14, border:`1.5px dashed #2a2a3d`, background:"transparent", color:C.purple, fontSize:14, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"'Inter',sans-serif" },
  formCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:16 },
  field: { width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 13px", color:C.text, fontSize:14, fontFamily:"'Inter',sans-serif", outline:"none", marginBottom:10, boxSizing:"border-box" },
  formRow: { display:"flex", gap:8, marginBottom:10 },
  toggleInc: (sel) => ({ flex:1, padding:10, borderRadius:10, border:`1.5px solid ${sel?"#34d399":"rgba(52,211,153,0.2)"}`, fontSize:13, fontWeight:600, cursor:"pointer", background: sel?"rgba(52,211,153,0.18)":"rgba(52,211,153,0.08)", color:C.green, fontFamily:"'Inter',sans-serif" }),
  toggleExp: (sel) => ({ flex:1, padding:10, borderRadius:10, border:`1.5px solid ${sel?"#f87171":"rgba(248,113,113,0.2)"}`, fontSize:13, fontWeight:600, cursor:"pointer", background: sel?"rgba(248,113,113,0.18)":"rgba(248,113,113,0.08)", color:C.red, fontFamily:"'Inter',sans-serif" }),
  submitInc: { width:"100%", padding:13, borderRadius:12, border:"none", fontSize:14, fontWeight:600, cursor:"pointer", background:"linear-gradient(135deg,#059669,#34d399)", color:"#fff", fontFamily:"'Inter',sans-serif" },
  submitExp: { width:"100%", padding:13, borderRadius:12, border:"none", fontSize:14, fontWeight:600, cursor:"pointer", background:"linear-gradient(135deg,#dc2626,#f87171)", color:"#fff", fontFamily:"'Inter',sans-serif" },
  txItem: { background:C.surface, border:`1px solid ${C.border2}`, borderRadius:14, padding:14, marginBottom:8, display:"flex", alignItems:"center", gap:12 },
  txIconInc: { width:42, height:42, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, background:"rgba(52,211,153,0.12)" },
  txIconExp: { width:42, height:42, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, background:"rgba(248,113,113,0.12)" },
  txInfo: { flex:1, minWidth:0 },
  txDesc: { fontSize:14, fontWeight:500, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  txMeta: { fontSize:11, color:C.muted, marginTop:2 },
  txAmtInc: { fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600, color:C.green, flexShrink:0 },
  txAmtExp: { fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600, color:C.red, flexShrink:0 },
  delBtn: { background:"none", border:"none", color:"#3a3a50", cursor:"pointer", fontSize:14, padding:4, lineHeight:1 },
  empty: { textAlign:"center", padding:"40px 20px", color:"#3a3a50" },
  chip: (active) => ({ padding:"6px 12px", borderRadius:20, border:`1px solid ${active?"#6366f1":C.border}`, background: active?"#1e1e30":C.surface, color: active?C.text:C.muted, fontSize:12, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Inter',sans-serif" }),
  insightCard: { background:C.surface, border:`1px solid ${C.border2}`, borderRadius:14, padding:14 },
  insightLabel: { fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, marginBottom:6 },
  insightVal: { fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:C.text },
  goalCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:10 },
  progressBg: { height:6, background:"#1a1a28", borderRadius:3, overflow:"hidden" },
  progressFill: { height:"100%", background:"linear-gradient(90deg,#6366f1,#818cf8)", borderRadius:3 },
  planSummary: { background:"linear-gradient(135deg,#1a1a2e,#16213e)", border:"1px solid #1e2d4a", borderRadius:16, padding:16, marginBottom:4 },
  planBarBg: { height:8, background:"#1a1a28", borderRadius:4, overflow:"hidden", marginTop:5 },
  planItem: { background:C.surface, border:`1px solid ${C.border2}`, borderRadius:14, padding:14, marginBottom:8, display:"flex", alignItems:"center", gap:12 },
  planCheck: (done) => ({ width:22, height:22, borderRadius:6, border:`1.5px solid ${done?"#34d399":"#2a2a3d"}`, background: done?"rgba(52,211,153,0.15)":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, color:C.green }),
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
  const [savedPlans, setSavedPlans] = useStored("financeOS-savedplans", []);
  const [activePlanId, setActivePlanId] = useStored("financeOS-activeplan", null);
  const [localItems, setLocalItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [planName, setPlanName] = useState("");
  const [form, setForm] = useState({ name:"", category:"Food & Drinks", amount:"" });

  const activePlan = savedPlans.find(p => p.id === activePlanId) || null;
  const items = activePlan ? activePlan.items : localItems;
  const setItems = activePlan
    ? (newItems) => setSavedPlans(savedPlans.map(p => p.id === activePlanId ? { ...p, items: typeof newItems === "function" ? newItems(p.items) : newItems } : p))
    : setLocalItems;

  const totalPlanned = items.reduce((s, i) => s + i.amount, 0);
  const totalDone = items.filter(i => i.done).reduce((s, i) => s + i.amount, 0);
  const remaining = income - totalPlanned;
  const pct = income > 0 ? Math.min(100, Math.round((totalPlanned / income) * 100)) : 0;
  const barColor = pct < 70 ? "linear-gradient(90deg,#059669,#34d399)" : pct < 90 ? "linear-gradient(90deg,#d97706,#fbbf24)" : "linear-gradient(90deg,#dc2626,#f87171)";

  const addItem = () => {
    const amt = parseFloat(form.amount);
    if (!form.name || isNaN(amt) || amt <= 0) return;
    setItems([...items, { id:Date.now(), name:form.name, category:form.category, amount:amt, done:false }]);
    setForm({ name:"", category:form.category, amount:"" });
    setShowForm(false);
  };

  const toggle = (id) => setItems(items.map(i => i.id === id ? { ...i, done:!i.done } : i));
  const remove = (id) => setItems(items.filter(i => i.id !== id));

  const savePlan = () => {
    if (!planName.trim()) return;
    if (activePlanId) {
      setSavedPlans(savedPlans.map(p => p.id === activePlanId ? { ...p, name: planName, items } : p));
    } else {
      const newPlan = { id: Date.now(), name: planName, items, createdAt: TODAY };
      setSavedPlans([...savedPlans, newPlan]);
      setActivePlanId(newPlan.id);
    }
    setShowSaveModal(false);
    setPlanName("");
  };

  const loadPlan = (plan) => {
    setActivePlanId(plan.id);
  };

  const newPlan = () => {
    setActivePlanId(null);
    setLocalItems([]);
  };

  const deletePlan = (id) => {
    setSavedPlans(savedPlans.filter(p => p.id !== id));
    if (activePlanId === id) { setActivePlanId(null); setItems([]); }
  };

  return (
    <div style={s.pad}>

      {/* Saved Plans Row */}
      {savedPlans.length > 0 && (
        <>
          <div style={s.sectionTitle}>Saved Plans</div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:12, scrollbarWidth:"none" }}>
            {savedPlans.map(p => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 10px 6px 12px", borderRadius:20, border:`1px solid ${p.id === activePlanId ? C.purple : C.border}`, background: p.id === activePlanId ? "rgba(99,102,241,0.15)" : C.surface, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}
                onClick={() => loadPlan(p)}>
                <span style={{ fontSize:12, fontWeight:500, color: p.id === activePlanId ? C.purple : C.text }}>{p.name}</span>
                <button style={{ ...s.delBtn, fontSize:11, marginLeft:2 }} onClick={e => { e.stopPropagation(); deletePlan(p.id); }}>x</button>
              </div>
            ))}
            <button style={{ ...s.chip(false), flexShrink:0 }} onClick={newPlan}>+ New</button>
          </div>
        </>
      )}

      {/* Active Plan Label */}
      <div style={{ ...s.planSummary, marginBottom: 12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: activePlan ? 12 : 0 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{activePlan ? activePlan.name : "Unsaved Plan"}</div>
            {!activePlan && items.length > 0 && <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Save this plan to keep it</div>}
          </div>
          <button style={{ padding:"7px 14px", borderRadius:10, border:"none", background: items.length === 0 ? "#1e1e30" : "linear-gradient(135deg,#4f46e5,#6366f1)", color: items.length === 0 ? C.muted : "#fff", fontSize:12, fontWeight:600, cursor: items.length === 0 ? "default" : "pointer", fontFamily:"'Inter',sans-serif" }}
            onClick={() => { if (items.length > 0) { setPlanName(activePlan ? activePlan.name : ""); setShowSaveModal(true); } }}>
            {activePlan ? "Rename / Update" : "Save Plan"}
          </button>
        </div>
        {items.length > 0 && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
              <span style={{ color:C.subtle }}>Monthly Income</span>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, color:C.green }}>EGP {fmt(income)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
              <span style={{ color:C.subtle }}>Planned Spending</span>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, color:C.red }}>EGP {fmt(totalPlanned)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
              <span style={{ color:C.subtle }}>Left to Allocate</span>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, color: remaining >= 0 ? C.text : C.red }}>EGP {fmt(remaining)}</span>
            </div>
            {income > 0 && (
              <div style={{ marginTop:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, marginBottom:5 }}>
                  <span>Budget used</span><span>{pct}%</span>
                </div>
                <div style={s.planBarBg}>
                  <div style={{ height:"100%", borderRadius:4, background:barColor, width:`${pct}%`, transition:"width .5s" }} />
                </div>
              </div>
            )}
          </>
        )}
        {income === 0 && <div style={{ fontSize:12, color:C.muted, marginTop: items.length > 0 ? 10 : 0 }}>Add your income in Transactions to see your budget.</div>}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 }}>
          <div style={{ background:"#111118", border:`1px solid ${C.border}`, borderRadius:20, padding:24, width:"100%", maxWidth:360 }}>
            <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:16 }}>Name your plan</div>
            <input style={s.field} placeholder="e.g. June Budget, Tight Month..." value={planName} onChange={e => setPlanName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && savePlan()} autoFocus />
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ ...s.field, color:C.muted, cursor:"pointer", flex:1, marginBottom:0 }} onClick={() => setShowSaveModal(false)}>Cancel</button>
              <button style={{ ...s.submitInc, flex:2 }} onClick={savePlan}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={s.sectionTitle}>Items - {items.length} total</div>

      {showForm && (
        <div style={{ ...s.formCard, marginBottom:10 }}>
          <input style={s.field} placeholder="What are you spending on?" value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} />
          <select style={s.field} value={form.category} onChange={e => setForm({ ...form, category:e.target.value })}>
            {PLAN_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <input style={s.field} type="number" placeholder="Planned amount (EGP)" value={form.amount} onChange={e => setForm({ ...form, amount:e.target.value })} />
          <div style={s.formRow}>
            <button style={{ ...s.field, color:C.muted, cursor:"pointer", flex:1, marginBottom:0 }} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={{ ...s.submitExp, flex:2 }} onClick={addItem}>Add to Plan</button>
          </div>
        </div>
      )}

      <button style={{ ...s.addBtn, marginBottom:12 }} onClick={() => setShowForm(true)}>+ Plan a Spend</button>

      {items.length === 0
        ? <div style={s.empty}><div style={{ fontSize:36, marginBottom:10 }}>🗓️</div><div style={{ fontSize:14 }}>No items yet - add what you expect to spend</div></div>
        : items.map(item => (
          <div key={item.id} style={s.planItem}>
            <div style={s.planCheck(item.done)} onClick={() => toggle(item.id)}>{item.done ? "✓" : ""}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:500, color: item.done ? C.muted : C.text, textDecoration: item.done ? "line-through" : "none" }}>{item.name}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{ICONS[item.category] || "•"} {item.category}</div>
            </div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600, color: item.done ? C.muted : C.red, flexShrink:0 }}>EGP {fmt(item.amount)}</div>
            <button style={s.delBtn} onClick={() => remove(item.id)}>x</button>
          </div>
        ))
      }

      {items.some(i => i.done) && (
        <div style={{ background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.15)", borderRadius:12, padding:"10px 14px", marginTop:4, fontSize:13, color:C.green }}>
          Done: EGP {fmt(totalDone)} of EGP {fmt(totalPlanned)} planned
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const [txs, setTxs, txsReady] = useStored("financeOS-txs", []);
  const [goals, setGoals, goalsReady] = useStored("financeOS-goals", []);
  const ready = txsReady && goalsReady;
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ type:"income", category:"Salary", description:"", amount:"", date:TODAY });
  const [goalForm, setGoalForm] = useState({ name:"", target:"", saved:"" });

  const totalIncome = useMemo(() => txs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [txs]);
  const totalExpense = useMemo(() => txs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [txs]);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const allCats = [...new Set(txs.map(t => t.category))];
  const filtered = useMemo(() => {
    let list = [...txs].reverse();
    if (filter === "income" || filter === "expense") return list.filter(t => t.type === filter);
    if (filter !== "all") return list.filter(t => t.category === filter);
    return list;
  }, [txs, filter]);

  const submitTx = () => {
    const amt = parseFloat(form.amount);
    if (!form.description || isNaN(amt) || amt <= 0) return;
    if (editId !== null) {
      setTxs(txs.map(t => t.id === editId ? { ...form, amount:amt, id:editId } : t));
      setEditId(null);
    } else {
      setTxs([...txs, { ...form, amount:amt, id:Date.now() }]);
    }
    setForm({ type:form.type, category:form.category, description:"", amount:"", date:TODAY });
    setShowForm(false);
  };

  const deleteTx = (id) => setTxs(txs.filter(t => t.id !== id));
  const startEdit = (tx) => {
    setForm({ type:tx.type, category:tx.category, description:tx.description, amount:String(tx.amount), date:tx.date });
    setEditId(tx.id); setShowForm(true); setTab("transactions");
  };

  const submitGoal = () => {
    const target = parseFloat(goalForm.target);
    const saved = parseFloat(goalForm.saved) || 0;
    if (!goalForm.name || isNaN(target) || target <= 0) return;
    setGoals([...goals, { id:Date.now(), name:goalForm.name, target, saved }]);
    setGoalForm({ name:"", target:"", saved:"" });
    setShowGoalForm(false);
  };

  const updateGoalSaved = (id, delta) => setGoals(goals.map(g => g.id === id ? { ...g, saved:Math.max(0, g.saved + delta) } : g));

  const catSpend = CATS.expense.map(c => ({
    cat:c, val:txs.filter(t => t.type === "expense" && t.category === c).reduce((s,t) => s + t.amount, 0)
  })).filter(c => c.val > 0).slice(0,6);
  const maxSpend = Math.max(...catSpend.map(c => c.val), 1);

  const rateColor = savingsRate >= 20 ? C.green : savingsRate >= 5 ? C.yellow : C.red;
  const rateMsg = savingsRate >= 20 ? "Great job - keep it up!" : savingsRate >= 5 ? "Room to improve" : "Spending exceeds income";

  if (!ready) return (
    <div style={{ ...s.app, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:C.muted }}>
        <div style={{ fontSize:32, marginBottom:12 }}>💰</div>
        <div style={{ fontSize:14 }}>Loading your data...</div>
      </div>
    </div>
  );

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />

      <div style={s.header}>
        <div style={s.headerTitle}>💰 FinanceOS</div>
        <div style={s.headerSub}>Your money, your rules - EGP</div>
      </div>

      <div style={s.balCard}>
        <div style={s.balLabel}>Net Balance</div>
        <div style={s.balAmt}><span style={s.balCurr}>EGP</span>{fmt(balance)}</div>
        <div style={s.balRow}>
          <div style={s.balMini}>
            <div style={s.miniLabel}>Income</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:600, color:C.green }}>+{fmt(totalIncome)}</div>
          </div>
          <div style={s.balMini}>
            <div style={s.miniLabel}>Spending</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:600, color:C.red }}>-{fmt(totalExpense)}</div>
          </div>
        </div>
      </div>

      <div style={s.nav}>
        {["overview","transactions","savings","plan"].map(t => (
          <button key={t} style={s.navBtn(tab===t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={s.pad}>
          <div style={{ ...s.insightCard, marginBottom:8 }}>
            <div style={s.insightLabel}>Savings Rate</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color:rateColor }}>{savingsRate}%</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{rateMsg}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
            <div style={s.insightCard}>
              <div style={s.insightLabel}>Transactions</div>
              <div style={s.insightVal}>{txs.length}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>total logged</div>
            </div>
            <div style={s.insightCard}>
              <div style={s.insightLabel}>Avg Expense</div>
              <div style={{ ...s.insightVal, fontSize:14 }}>EGP {txs.filter(t=>t.type==="expense").length ? fmt(totalExpense/txs.filter(t=>t.type==="expense").length) : "0.00"}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>per transaction</div>
            </div>
          </div>

          {catSpend.length > 0 && (
            <>
              <div style={s.sectionTitle}>Top Expenses by Category</div>
              <div style={{ ...s.insightCard, marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:70, marginBottom:4 }}>
                  {catSpend.map(c => (
                    <div key={c.cat} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                      <div style={{ width:"100%", borderRadius:"4px 4px 0 0", background:"linear-gradient(180deg,#f87171,#dc2626)", height:`${Math.max(6,(c.val/maxSpend)*60)}px` }} />
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:4 }}>
                  {catSpend.map(c => (
                    <div key={c.cat} style={{ flex:1, textAlign:"center", fontSize:9, color:"#3a3a50" }}>{c.cat.split(" ")[0]}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={s.sectionTitle}>Recent Transactions</div>
          {txs.length === 0
            ? <div style={{ ...s.empty, padding:"20px 0" }}><div style={{ fontSize:14 }}>No transactions yet</div></div>
            : txs.slice(-3).reverse().map(tx => (
              <div key={tx.id} style={s.txItem}>
                <div style={tx.type==="income" ? s.txIconInc : s.txIconExp}>{ICONS[tx.category]||"•"}</div>
                <div style={s.txInfo}>
                  <div style={s.txDesc}>{tx.description}</div>
                  <div style={s.txMeta}>{tx.category} - {tx.date}</div>
                </div>
                <div style={tx.type==="income" ? s.txAmtInc : s.txAmtExp}>{tx.type==="income"?"+":"-"}EGP {fmt(tx.amount)}</div>
              </div>
            ))
          }
          <button style={{ ...s.addBtn, marginTop:8 }} onClick={() => { setTab("transactions"); setShowForm(true); }}>+ Add Transaction</button>
        </div>
      )}

      {tab === "transactions" && (
        <div style={s.pad}>
          {(showForm || editId !== null) ? (
            <>
              <div style={s.sectionTitle}>{editId ? "Edit Transaction" : "New Transaction"}</div>
              <div style={s.formCard}>
                <div style={s.formRow}>
                  <button style={s.toggleInc(form.type==="income")} onClick={() => setForm({ ...form, type:"income", category:"Salary" })}>Up Income</button>
                  <button style={s.toggleExp(form.type==="expense")} onClick={() => setForm({ ...form, type:"expense", category:"Food & Drinks" })}>Down Expense</button>
                </div>
                <select style={s.field} value={form.category} onChange={e => setForm({ ...form, category:e.target.value })}>
                  {CATS[form.type].map(c => <option key={c}>{c}</option>)}
                </select>
                <input style={s.field} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} />
                <input style={s.field} type="number" placeholder="Amount (EGP)" value={form.amount} onChange={e => setForm({ ...form, amount:e.target.value })} />
                <input style={s.field} type="date" value={form.date} onChange={e => setForm({ ...form, date:e.target.value })} />
                <div style={{ display:"flex", gap:8 }}>
                  <button style={{ ...s.field, color:C.muted, cursor:"pointer", flex:1, marginBottom:0 }} onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
                  <button style={{ ...(form.type==="income" ? s.submitInc : s.submitExp), flex:2 }} onClick={submitTx}>{editId ? "Save Changes" : (form.type==="income" ? "Add Income" : "Add Expense")}</button>
                </div>
              </div>
            </>
          ) : (
            <button style={s.addBtn} onClick={() => { setShowForm(true); setEditId(null); }}>+ Add Transaction</button>
          )}

          <div style={s.sectionTitle}>Filter</div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, marginBottom:12, scrollbarWidth:"none" }}>
            {["all","income","expense",...allCats].map(f => (
              <button key={f} style={s.chip(filter===f)} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>

          {filtered.length === 0
            ? <div style={s.empty}><div style={{ fontSize:36, marginBottom:10 }}>📭</div><div style={{ fontSize:14 }}>No transactions yet</div></div>
            : filtered.map(tx => (
              <div key={tx.id} style={s.txItem}>
                <div style={tx.type==="income" ? s.txIconInc : s.txIconExp}>{ICONS[tx.category]||"•"}</div>
                <div style={s.txInfo}>
                  <div style={s.txDesc}>{tx.description}</div>
                  <div style={s.txMeta}>{tx.category} - {tx.date}</div>
                </div>
                <div style={tx.type==="income" ? s.txAmtInc : s.txAmtExp}>{tx.type==="income"?"+":"-"}EGP {fmt(tx.amount)}</div>
                <button style={s.delBtn} onClick={() => startEdit(tx)}>✏️</button>
                <button style={s.delBtn} onClick={() => deleteTx(tx.id)}>x</button>
              </div>
            ))
          }
        </div>
      )}

      {tab === "savings" && (
        <div style={s.pad}>
          <div style={{ ...s.insightCard, marginBottom:10 }}>
            <div style={s.insightLabel}>Available to Save</div>
            <div style={{ ...s.insightVal, fontSize:22, color: balance >= 0 ? C.green : C.red }}>EGP {fmt(Math.max(0, balance))}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>net balance this period</div>
          </div>

          <div style={s.sectionTitle}>Savings Goals</div>
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
            return (
              <div key={g.id} style={s.goalCard}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{g.name}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Target: EGP {fmt(g.target)}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:12, color:C.purple, fontWeight:600, background:"rgba(99,102,241,0.12)", padding:"2px 8px", borderRadius:20 }}>{pct}%</span>
                    <button style={{ ...s.delBtn, fontSize:14 }} onClick={() => setGoals(goals.filter(x => x.id !== g.id))}>x</button>
                  </div>
                </div>
                <div style={s.progressBg}><div style={{ ...s.progressFill, width:`${pct}%` }} /></div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:C.muted }}>
                  <span>Saved: EGP {fmt(g.saved)}</span>
                  <span>Left: EGP {fmt(Math.max(0, g.target - g.saved))}</span>
                </div>
                <GoalAdjust id={g.id} onAdjust={updateGoalSaved} />
              </div>
            );
          })}

          {showGoalForm ? (
            <div style={s.formCard}>
              <div style={{ ...s.sectionTitle, margin:"0 0 12px" }}>New Goal</div>
              <input style={s.field} placeholder="Goal name (e.g. Car, Vacation)" value={goalForm.name} onChange={e => setGoalForm({ ...goalForm, name:e.target.value })} />
              <input style={s.field} type="number" placeholder="Target amount (EGP)" value={goalForm.target} onChange={e => setGoalForm({ ...goalForm, target:e.target.value })} />
              <input style={s.field} type="number" placeholder="Already saved (EGP, optional)" value={goalForm.saved} onChange={e => setGoalForm({ ...goalForm, saved:e.target.value })} />
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ ...s.field, color:C.muted, cursor:"pointer", flex:1, marginBottom:0 }} onClick={() => setShowGoalForm(false)}>Cancel</button>
                <button style={{ ...s.submitInc, flex:2 }} onClick={submitGoal}>Create Goal</button>
              </div>
            </div>
          ) : (
            <button style={s.addBtn} onClick={() => setShowGoalForm(true)}>+ New Savings Goal</button>
          )}
        </div>
      )}

      {tab === "plan" && <PlanTab income={totalIncome} />}
    </div>
  );
}
