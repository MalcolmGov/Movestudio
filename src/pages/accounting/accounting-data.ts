export type TxType = 'income' | 'expense'
export type ReportView = 'dashboard' | 'transactions' | 'reports' | 'vat'

export interface Transaction {
  id: string; type: TxType; amount: number; vatAmount: number
  category: string; description: string; reference: string
  date: number; reconciled: boolean
}
export interface BudgetItem { id: string; category: string; monthly: number }

export const INCOME_CATS = ['Sales Revenue','Service Fees','Consulting','Project Income','Interest Received','Other Income']
export const EXPENSE_CATS = ['Cost of Goods Sold','Salaries & Wages','Rent & Premises','Utilities','Marketing & Advertising','Travel & Transport','Office Supplies','Software & Subscriptions','Professional Services','Bank Charges','Insurance','Repairs & Maintenance','Other Expenses']
export const ALL_CATS = [...INCOME_CATS, ...EXPENSE_CATS]

export const CAT_ICONS: Record<string, string> = {
  'Sales Revenue':'💰','Service Fees':'🛠','Consulting':'💼','Project Income':'📋','Interest Received':'🏦','Other Income':'✦',
  'Cost of Goods Sold':'📦','Salaries & Wages':'👥','Rent & Premises':'🏢','Utilities':'⚡','Marketing & Advertising':'📣',
  'Travel & Transport':'🚗','Office Supplies':'🖊','Software & Subscriptions':'💻','Professional Services':'📄','Bank Charges':'🏦',
  'Insurance':'🛡','Repairs & Maintenance':'🔧','Other Expenses':'📁',
}

export const VAT_RATE = 0.15

// Helpers
export const fmt = (v: number, abs = false) => `R ${(abs ? Math.abs(v) : v).toLocaleString('en-ZA', { minimumFractionDigits:2, maximumFractionDigits:2 })}`
export const fmtShort = (v: number) => `R ${Math.abs(v) >= 1000 ? (Math.abs(v)/1000).toFixed(1)+'k' : Math.abs(v).toFixed(0)}`
export const uid = () => Math.random().toString(36).slice(2,10)
export const monthKey = (ts: number) => new Date(ts).toISOString().slice(0,7)
export const monthLabel = (key: string) => new Date(key+'-01').toLocaleString('en-ZA',{month:'short',year:'numeric'})
export const isIncome = (cat: string) => INCOME_CATS.includes(cat)

// Seed data — realistic 4-month SA business
const d = (months: number, day: number) => { const dt = new Date(); dt.setMonth(dt.getMonth()-months, day); dt.setHours(9,0,0,0); return dt.getTime() }

export const SEED_TX: Transaction[] = [
  // 3 months ago
  { id:'t1',  type:'income',  amount:42000, vatAmount:5478.26, category:'Sales Revenue',           description:'Website design project — TechCorp SA',    reference:'INV-0031', date:d(3,5),  reconciled:true },
  { id:'t2',  type:'income',  amount:18500, vatAmount:2413.04, category:'Service Fees',            description:'Monthly retainer — Creative Agency',        reference:'INV-0032', date:d(3,8),  reconciled:true },
  { id:'t3',  type:'expense', amount:15000, vatAmount:0,       category:'Salaries & Wages',        description:'Staff salary — March',                      reference:'PAY-031',  date:d(3,25), reconciled:true },
  { id:'t4',  type:'expense', amount:8500,  vatAmount:1108.70, category:'Cost of Goods Sold',      description:'Design assets & stock photos',              reference:'REC-041',  date:d(3,10), reconciled:true },
  { id:'t5',  type:'expense', amount:4500,  vatAmount:586.96,  category:'Rent & Premises',         description:'Office rent — March',                       reference:'RENT-03',  date:d(3,1),  reconciled:true },
  { id:'t6',  type:'expense', amount:899,   vatAmount:117.26,  category:'Software & Subscriptions',description:'Adobe Creative Cloud annual',                reference:'ADOBECC',  date:d(3,12), reconciled:true },
  { id:'t7',  type:'expense', amount:650,   vatAmount:84.78,   category:'Utilities',               description:'Electricity & internet — March',            reference:'UTIL-03',  date:d(3,3),  reconciled:true },
  { id:'t8',  type:'income',  amount:9800,  vatAmount:1278.26, category:'Consulting',              description:'Brand strategy session — RetailPlus',       reference:'INV-0033', date:d(3,18), reconciled:true },
  // 2 months ago
  { id:'t9',  type:'income',  amount:55000, vatAmount:7173.91, category:'Sales Revenue',           description:'E-commerce platform — HealthFirst Clinics', reference:'INV-0034', date:d(2,3),  reconciled:true },
  { id:'t10', type:'income',  amount:18500, vatAmount:2413.04, category:'Service Fees',            description:'Monthly retainer — Creative Agency',        reference:'INV-0035', date:d(2,8),  reconciled:true },
  { id:'t11', type:'expense', amount:15000, vatAmount:0,       category:'Salaries & Wages',        description:'Staff salary — April',                      reference:'PAY-041',  date:d(2,25), reconciled:true },
  { id:'t12', type:'expense', amount:4500,  vatAmount:586.96,  category:'Rent & Premises',         description:'Office rent — April',                       reference:'RENT-04',  date:d(2,1),  reconciled:true },
  { id:'t13', type:'expense', amount:12000, vatAmount:1565.22, category:'Marketing & Advertising', description:'Google Ads & social media campaign',         reference:'MKTG-04',  date:d(2,15), reconciled:true },
  { id:'t14', type:'expense', amount:3200,  vatAmount:417.39,  category:'Travel & Transport',      description:'Client visits & fuel — April',              reference:'TRVL-04',  date:d(2,20), reconciled:true },
  { id:'t15', type:'expense', amount:650,   vatAmount:84.78,   category:'Utilities',               description:'Electricity & internet — April',            reference:'UTIL-04',  date:d(2,3),  reconciled:true },
  { id:'t16', type:'income',  amount:14500, vatAmount:1891.30, category:'Project Income',          description:'Mobile app UI design — Solar SA',            reference:'INV-0036', date:d(2,22), reconciled:true },
  { id:'t17', type:'expense', amount:2100,  vatAmount:273.91,  category:'Professional Services',   description:'Accountant fees — April',                   reference:'ACCT-04',  date:d(2,28), reconciled:false },
  // 1 month ago
  { id:'t18', type:'income',  amount:38000, vatAmount:4956.52, category:'Sales Revenue',           description:'Brand identity package — FreshMart',        reference:'INV-0037', date:d(1,6),  reconciled:true },
  { id:'t19', type:'income',  amount:18500, vatAmount:2413.04, category:'Service Fees',            description:'Monthly retainer — Creative Agency',        reference:'INV-0038', date:d(1,8),  reconciled:true },
  { id:'t20', type:'expense', amount:18000, vatAmount:0,       category:'Salaries & Wages',        description:'Staff salary + bonus — May',                reference:'PAY-051',  date:d(1,25), reconciled:true },
  { id:'t21', type:'expense', amount:4500,  vatAmount:586.96,  category:'Rent & Premises',         description:'Office rent — May',                         reference:'RENT-05',  date:d(1,1),  reconciled:true },
  { id:'t22', type:'expense', amount:650,   vatAmount:84.78,   category:'Utilities',               description:'Electricity & internet — May',              reference:'UTIL-05',  date:d(1,3),  reconciled:true },
  { id:'t23', type:'income',  amount:6500,  vatAmount:847.83,  category:'Consulting',              description:'Strategy session — FinSolve referral',       reference:'INV-0039', date:d(1,14), reconciled:true },
  { id:'t24', type:'expense', amount:4800,  vatAmount:626.09,  category:'Cost of Goods Sold',      description:'Stock imagery & templates',                 reference:'REC-055',  date:d(1,10), reconciled:false },
  { id:'t25', type:'expense', amount:1200,  vatAmount:156.52,  category:'Insurance',               description:'Business insurance — May',                  reference:'INS-05',   date:d(1,2),  reconciled:true },
  { id:'t26', type:'income',  amount:280,   vatAmount:0,       category:'Interest Received',       description:'Business savings account interest',          reference:'BANK-INT', date:d(1,31), reconciled:true },
  // This month
  { id:'t27', type:'income',  amount:85000, vatAmount:11086.96,category:'Sales Revenue',           description:'Full platform build — TechCorp SA',          reference:'INV-0040', date:d(0,4),  reconciled:false },
  { id:'t28', type:'income',  amount:18500, vatAmount:2413.04, category:'Service Fees',            description:'Monthly retainer — Creative Agency',        reference:'INV-0041', date:d(0,8),  reconciled:true },
  { id:'t29', type:'expense', amount:18000, vatAmount:0,       category:'Salaries & Wages',        description:'Staff salary — June',                       reference:'PAY-061',  date:d(0,25), reconciled:false },
  { id:'t30', type:'expense', amount:4500,  vatAmount:586.96,  category:'Rent & Premises',         description:'Office rent — June',                        reference:'RENT-06',  date:d(0,1),  reconciled:true },
  { id:'t31', type:'expense', amount:650,   vatAmount:84.78,   category:'Utilities',               description:'Electricity & internet — June',             reference:'UTIL-06',  date:d(0,3),  reconciled:true },
  { id:'t32', type:'expense', amount:6500,  vatAmount:847.83,  category:'Marketing & Advertising', description:'LinkedIn ads campaign',                      reference:'MKTG-06',  date:d(0,12), reconciled:false },
]

export const SEED_BUDGETS: BudgetItem[] = [
  { id:'b1', category:'Salaries & Wages',        monthly:18000 },
  { id:'b2', category:'Rent & Premises',         monthly:4500  },
  { id:'b3', category:'Marketing & Advertising', monthly:8000  },
  { id:'b4', category:'Software & Subscriptions',monthly:1200  },
  { id:'b5', category:'Travel & Transport',      monthly:3000  },
  { id:'b6', category:'Utilities',               monthly:800   },
  { id:'b7', category:'Cost of Goods Sold',      monthly:10000 },
  { id:'b8', category:'Professional Services',   monthly:2500  },
]

const KEY = 'acc_v1'
export const loadAcc = (): { transactions:Transaction[]; budgets:BudgetItem[] } => {
  try { const r=localStorage.getItem(KEY); if(r) return JSON.parse(r) } catch {}
  return { transactions:SEED_TX, budgets:SEED_BUDGETS }
}
export const saveAcc = (transactions:Transaction[], budgets:BudgetItem[]) =>
  localStorage.setItem(KEY, JSON.stringify({ transactions, budgets }))

// Compute helpers
export const getTotals = (txs: Transaction[]) => {
  const income  = txs.filter(t=>t.type==='income' ).reduce((s,t)=>s+t.amount,0)
  const expense = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)
  const outputVat = txs.filter(t=>t.type==='income' ).reduce((s,t)=>s+t.vatAmount,0)
  const inputVat  = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.vatAmount,0)
  return { income, expense, profit:income-expense, outputVat, inputVat, vatDue:outputVat-inputVat }
}

export const getMonthlyData = (txs: Transaction[]) => {
  const map: Record<string,{income:number;expense:number}> = {}
  txs.forEach(t => {
    const k = monthKey(t.date)
    if(!map[k]) map[k]={income:0,expense:0}
    if(t.type==='income') map[k].income+=t.amount
    else map[k].expense+=t.amount
  })
  return Object.entries(map).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>({month:monthLabel(k),key:k,...v,profit:v.income-v.expense}))
}

export const getCategoryTotals = (txs: Transaction[], type: TxType) =>
  txs.filter(t=>t.type===type).reduce((acc,t)=>{
    acc[t.category]=(acc[t.category]||0)+t.amount; return acc
  },{} as Record<string,number>)
