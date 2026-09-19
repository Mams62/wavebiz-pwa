import "./styles.css";

type Dashboard = { todaySales: number; todayTransactions: number; productCount: number; lowStockCount: number; currency: string };
type Product = { id: string; name: string; sku?: string; sellingPrice: number; quantity: number; lowStockThreshold: number };

const API = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });
const app = document.querySelector<HTMLDivElement>("#app")!;
let businessId = localStorage.getItem("wavebiz.businessId") || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.detail || "Something went wrong"); }
  return response.json();
}

function shell(content: string) {
  app.innerHTML = `<main><header><div class="brand"><span>W</span>WaveBiz</div><button class="ghost" id="install" hidden>Install app</button></header>${content}<nav><button data-view="dashboard">Home</button><button data-view="products">Products</button><button data-view="sale">Sell</button></nav></main>`;
  document.querySelectorAll<HTMLElement>("[data-view]").forEach(x => x.onclick = () => render(x.dataset.view!));
}

async function dashboard() {
  if (!businessId) return onboarding();
  shell(`<section class="intro"><p class="eyebrow">YOUR BUSINESS TODAY</p><h1 id="sales">—</h1><p id="status">Loading live figures…</p></section>
    <h2>Quick actions</h2><section class="grid"><button class="tile" data-view="sale"><b>New sale</b><small>Record income</small></button><button class="tile" data-view="products"><b>Products</b><small>Manage stock</small></button></section>
    <section class="stats"><article><small>Transactions</small><b id="transactions">—</b></article><article><small>Products</small><b id="products">—</b></article><article><small>Low stock</small><b id="low">—</b></article></section>`);
  document.querySelectorAll<HTMLElement>("[data-view]").forEach(x => x.onclick = () => render(x.dataset.view!));
  try {
    const data = await request<Dashboard>(`/api/v1/businesses/${businessId}/dashboard`);
    text("sales", money.format(data.todaySales)); text("status", "Live from your WaveBiz records"); text("transactions", String(data.todayTransactions)); text("products", String(data.productCount)); text("low", String(data.lowStockCount));
  } catch (e) { text("status", e instanceof Error ? e.message : "Unable to load dashboard"); }
}

function onboarding() {
  shell(`<section class="welcome"><p class="eyebrow">WELCOME TO WAVEBIZ</p><h1>Run your business smarter.</h1><p>Set up your business and begin with real sales and stock records.</p>
    <form id="business-form"><label>Business name<input required maxlength="120" name="name" placeholder="e.g. Ada Stores" /></label><label>Phone number<input maxlength="20" name="phone" inputmode="tel" placeholder="080…" /></label><button class="primary">Create business</button><p class="error" id="error"></p></form></section>`);
  document.querySelector<HTMLFormElement>("#business-form")!.onsubmit = async event => {
    event.preventDefault(); const formElement = event.currentTarget as HTMLFormElement; const form = new FormData(formElement); try {
      const result = await request<{id:string}>("/api/v1/businesses", { method: "POST", body: JSON.stringify({ name: form.get("name"), phone: form.get("phone") || null }) });
      businessId = result.id; localStorage.setItem("wavebiz.businessId", businessId); dashboard();
    } catch (e) { text("error", e instanceof Error ? e.message : "Could not create business"); }
  };
}

async function products() {
  if (!businessId) return onboarding();
  shell(`<section class="page-title"><p class="eyebrow">INVENTORY</p><h1>Products</h1></section><form id="product-form" class="card"><label>Product name<input required name="name" /></label><div class="row"><label>Selling price<input required min="0" step="0.01" type="number" inputmode="decimal" name="price" /></label><label>Opening stock<input required min="0" step="0.001" type="number" inputmode="decimal" name="quantity" /></label></div><button class="primary">Add product</button><p class="error" id="error"></p></form><section id="product-list" class="list"></section>`);
  const load = async () => { const items = await request<Product[]>(`/api/v1/businesses/${businessId}/products`); document.querySelector("#product-list")!.innerHTML = items.length ? items.map(p => `<article><div><b>${escapeHtml(p.name)}</b><small>${money.format(p.sellingPrice)}</small></div><strong>${p.quantity} in stock</strong></article>`).join("") : `<p class="empty">No products yet.</p>`; };
  await load().catch(e => text("error", e.message));
  document.querySelector<HTMLFormElement>("#product-form")!.onsubmit = async event => { event.preventDefault(); const formElement = event.currentTarget as HTMLFormElement; const f = new FormData(formElement); try { await request(`/api/v1/businesses/${businessId}/products`, { method: "POST", body: JSON.stringify({ name:f.get("name"), sku:null, sellingPrice:Number(f.get("price")), openingQuantity:Number(f.get("quantity")), lowStockThreshold:0 }) }); formElement.reset(); await load(); } catch(e) { text("error", e instanceof Error ? e.message : "Could not add product"); } };
}

async function sale() {
  if (!businessId) return onboarding();
  shell(`<section class="page-title"><p class="eyebrow">CHECKOUT</p><h1>New sale</h1></section><form id="sale-form" class="card"><label>Product<select required name="product"><option value="">Choose product</option></select></label><label>Quantity<input required min="0.001" step="0.001" type="number" inputmode="decimal" name="quantity" value="1" /></label><label>Payment method<select name="payment"><option>CASH</option><option>TRANSFER</option><option>POS</option><option>CREDIT</option></select></label><button class="primary">Complete sale</button><p class="error" id="error"></p></form>`);
  try { const items = await request<Product[]>(`/api/v1/businesses/${businessId}/products`); const select = document.querySelector<HTMLSelectElement>("select[name=product]")!; select.innerHTML += items.map(p => `<option value="${p.id}">${escapeHtml(p.name)} — ${p.quantity} available</option>`).join(""); } catch(e) { text("error", e instanceof Error ? e.message : "Could not load products"); }
  document.querySelector<HTMLFormElement>("#sale-form")!.onsubmit = async event => { event.preventDefault(); const formElement = event.currentTarget as HTMLFormElement; const f = new FormData(formElement); try { await request(`/api/v1/businesses/${businessId}/sales`, { method:"POST", body:JSON.stringify({ items:[{productId:f.get("product"), quantity:Number(f.get("quantity"))}], paymentMethod:f.get("payment") }) }); await dashboard(); } catch(e) { text("error", e instanceof Error ? e.message : "Could not record sale"); } };
}

function render(view: string) { if (view === "products") products(); else if (view === "sale") sale(); else dashboard(); }
function text(id: string, value: string) { const node = document.getElementById(id); if (node) node.textContent = value; }
function escapeHtml(value: string) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }

if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
render("dashboard");
