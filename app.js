/* COMPUGUED V1.0
   Prototipo frontend. Los datos se guardan en localStorage del navegador.
   IMPORTANTE: el acceso administrador de esta demo NO es seguro para producción.
   Antes de publicar, conectar backend (p. ej. Supabase), autenticación y políticas RLS.
*/
const CONFIG = {
  // Reemplaza por el WhatsApp comercial de COMPUGUED: código de país + número, sin + ni espacios.
  whatsapp: "51999999999",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  // Contraseña temporal SOLO para probar el prototipo local. Cámbiala y no la uses en producción.
  demoAdminPassword: "Compugued2026!"
};

const STORAGE = { products: "compugued_products_v1", settings: "compugued_settings_v1" };
const sampleProducts = [
  {id:"p1",code:"LAP-001",name:"Laptop para estudio y trabajo",category:"Laptops",brand:"Lenovo",price:2399,image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",description:"Ideal para clases, oficina y productividad diaria.",specs:"Core i5 · 8 GB RAM · SSD 512 GB",status:"Disponible",featured:true,published:true},
  {id:"p2",code:"PCG-001",name:"PC Semi Gamer personalizada",category:"Computadoras",brand:"COMPUGUED",price:3299,image:"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",description:"Configuración equilibrada para jugar y trabajar.",specs:"Configuración según presupuesto",status:"Por pedido",featured:true,published:true},
  {id:"p3",code:"IMP-001",name:"Impresora multifuncional",category:"Impresoras",brand:"Epson",price:899,image:"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=700&q=80",description:"Solución práctica para el hogar y pequeños negocios.",specs:"Impresión · Copia · Escaneo",status:"Disponible",featured:false,published:true},
  {id:"p4",code:"ACC-001",name:"Teclado y mouse inalámbricos",category:"Accesorios",brand:"Logitech",price:129,image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",description:"Conjunto cómodo para tu espacio de trabajo.",specs:"Conexión inalámbrica · Diseño compacto",status:"Disponible",featured:false,published:true},
  {id:"p5",code:"COM-001",name:"Memoria RAM para PC",category:"Componentes",brand:"Kingston",price:189,image:"https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=700&q=80",description:"Componente para ampliar la capacidad de tu equipo.",specs:"Consultar capacidad y compatibilidad",status:"Por pedido",featured:false,published:true},
  {id:"p6",code:"LAP-002",name:"Laptop de alto rendimiento",category:"Laptops",brand:"ASUS",price:4299,image:"https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=80",description:"Rendimiento para tareas exigentes y creación.",specs:"Gráficos dedicados · SSD · Pantalla FHD",status:"Sin stock",featured:true,published:true},
  {id:"p7",code:"ACC-002",name:"Audífonos para computadora",category:"Accesorios",brand:"Genérico",price:99,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",description:"Audio para reuniones, clases y entretenimiento.",specs:"Micrófono integrado",status:"Disponible",featured:false,published:true},
  {id:"p8",code:"PC-002",name:"PC de oficina personalizada",category:"Computadoras",brand:"COMPUGUED",price:1899,image:"https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=700&q=80",description:"Equipo configurable para productividad y gestión.",specs:"Componentes seleccionados a tu medida",status:"Por pedido",featured:false,published:true}
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clone = (value) => JSON.parse(JSON.stringify(value));
let products = load(STORAGE.products, sampleProducts);
let settings = load(STORAGE.settings, {whatsapp:CONFIG.whatsapp,facebook:CONFIG.facebook,instagram:CONFIG.instagram});
let toastTimer;

function load(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : clone(fallback); }
  catch { return clone(fallback); }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function money(value) {
  return Number(value) > 0 ? new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN",maximumFractionDigits:2}).format(Number(value)) : "Consultar";
}
function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function waLink(message) {
  const number = (settings.whatsapp || "").replace(/\D/g,"");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
function notify(message) {
  const toast=$("#toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function applyContactLinks() {
  const general=waLink("Hola COMPUGUED, quisiera recibir información sobre sus productos y servicios.");
  ["#headerWhatsApp","#footerWhatsApp","#floatingWhatsApp"].forEach(sel=>$(sel).href=general);
  $("#customWhatsApp").href=waLink("Hola COMPUGUED, deseo cotizar una computadora personalizada. Mi presupuesto es...");
  $("#facebookLink").href=settings.facebook || "#";
  $("#instagramLink").href=settings.instagram || "#";
  $$(".service-link").forEach(link=>link.href=waLink(`Hola COMPUGUED, quisiera información sobre: ${link.dataset.service}.`));
}
function badgeClass(status) {
  return status==="Sin stock"?"sold":status==="Por pedido"?"order":"";
}
function renderProducts() {
  const query=$("#searchInput").value.trim().toLowerCase();
  const category=$("#categoryFilter").value;
  const availability=$("#availabilityFilter").value;
  const sort=$("#sortFilter").value;
  let list=products.filter(p=>p.published!==false);
  if(category!=="Todos") list=list.filter(p=>p.category===category);
  if(availability!=="Todos") list=list.filter(p=>p.status===availability);
  if(query) list=list.filter(p=>[p.name,p.brand,p.code,p.category,p.description,p.specs].join(" ").toLowerCase().includes(query));
  if(sort==="price-asc") list.sort((a,b)=>(Number(a.price)||0)-(Number(b.price)||0));
  if(sort==="price-desc") list.sort((a,b)=>(Number(b.price)||0)-(Number(a.price)||0));
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
  if(sort==="featured") list.sort((a,b)=>Number(b.featured)-Number(a.featured));
  $("#catalogCount").textContent=`${list.length} ${list.length===1?"producto":"productos"}`;
  $("#productGrid").innerHTML=list.map(p=>{
    const sold=p.status==="Sin stock";
    const contactText=sold?"Consultar disponibilidad":"Consultar por WhatsApp";
    const message=`Hola COMPUGUED, estoy interesado en ${p.name}${p.code?` (código ${p.code})`:""}. ¿Podrían brindarme información y confirmar disponibilidad?`;
    return `<article class="product-card ${sold?"out-of-stock":""}">
      <div class="product-image"><img src="${escapeHTML(p.image||"")}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.src='https://placehold.co/600x450/f1f4f8/718096?text=COMPUGUED'">
        <span class="product-badge ${badgeClass(p.status)}">${escapeHTML(p.status||"Consultar")}</span>${p.featured?'<span class="featured-tag">★ Destacado</span>':""}
      </div><div class="product-info"><span class="product-category">${escapeHTML(p.category||"Tecnología")}</span><h3>${escapeHTML(p.name)}</h3>
      <p class="product-description">${escapeHTML(p.description||"Consulta por más información.")}</p><div class="product-specs">${escapeHTML(p.specs||"")}</div>
      <div class="product-bottom"><span class="product-price">${money(p.price)}${Number(p.price)>0?'<small> PEN</small>':""}</span><a class="product-contact ${sold?"disabled":""}" ${sold?'aria-disabled="true"':`href="${waLink(message)}" target="_blank" rel="noopener"`}>${contactText}</a></div></div></article>`;
  }).join("");
  $("#emptyState").classList.toggle("hidden",list.length!==0);
  $("#productGrid").classList.toggle("hidden",list.length===0);
}
function setCategory(category) {
  $("#categoryFilter").value=category;
  $$(".category-card").forEach(card=>card.classList.toggle("active",card.dataset.category===category));
  renderProducts();
}
function refreshCategoryOptions() {
  const categories=[...new Set(products.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
  const current=$("#categoryFilter").value||"Todos";
  $("#categoryFilter").innerHTML='<option value="Todos">Todas las categorías</option>'+categories.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  $("#categoryFilter").value=categories.includes(current)?current:"Todos";
}
function renderAdminProducts() {
  $("#adminProductList").innerHTML=products.map(p=>`<div class="admin-product-row">
    <img src="${escapeHTML(p.image||"")}" alt="" onerror="this.src='https://placehold.co/100x100?text=CG'">
    <div class="row-info"><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.code||"Sin código")} · ${escapeHTML(p.status)} · ${p.published===false?"Oculto":"Publicado"}</small></div>
    <div class="row-actions"><button data-edit="${p.id}">Editar</button><button data-copy="${p.id}">Duplicar</button><button data-delete="${p.id}" aria-label="Eliminar">×</button></div>
  </div>`).join("") || '<p class="admin-hint">Todavía no hay productos registrados.</p>';
}
function openProductForm(product=null) {
  $("#productForm").classList.remove("hidden");
  $("#productFormTitle").textContent=product?"Editar producto":"Nuevo producto";
  $("#productId").value=product?.id||"";
  $("#productName").value=product?.name||"";
  $("#productCode").value=product?.code||"";
  $("#productCategory").value=product?.category||"Laptops";
  $("#productBrand").value=product?.brand||"";
  $("#productPrice").value=product?.price??"";
  $("#productStatus").value=product?.status||"Por pedido";
  $("#productImage").value=product?.image||"";
  $("#productDescription").value=product?.description||"";
  $("#productSpecs").value=product?.specs||"";
  $("#productFeatured").checked=!!product?.featured;
  $("#productPublished").checked=product?.published!==false;
  $("#productForm").scrollIntoView({behavior:"smooth",block:"start"});
}
function resetProductForm() { $("#productForm").reset(); $("#productId").value=""; $("#productForm").classList.add("hidden"); }
function showAdmin() { $("#adminModal").classList.remove("hidden"); $("#loginView").classList.remove("hidden"); $("#adminView").classList.add("hidden"); $("#adminPassword").value=""; $("#loginError").textContent=""; }
function closeAdmin() { $("#adminModal").classList.add("hidden"); }
function switchTab(tab) {
  $$(".admin-tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  $$(".admin-panel").forEach(p=>p.classList.toggle("hidden",p.id!==tab));
}
function setupEvents() {
  $("#searchInput").addEventListener("input",renderProducts);
  $("#categoryFilter").addEventListener("change",()=>setCategory($("#categoryFilter").value));
  $("#availabilityFilter").addEventListener("change",renderProducts);
  $("#sortFilter").addEventListener("change",renderProducts);
  $("#clearFilters").addEventListener("click",()=>{$("#searchInput").value="";$("#availabilityFilter").value="Todos";$("#sortFilter").value="featured";setCategory("Todos");});
  $$(".category-card").forEach(card=>card.addEventListener("click",()=>setCategory(card.dataset.category)));
  $("#focusSearch").addEventListener("click",()=>{$("#searchInput").focus();$("#catalogo").scrollIntoView({behavior:"smooth"});});
  $("#menuToggle").addEventListener("click",()=>{$(".desktop-nav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String($(".desktop-nav").classList.contains("open")));});
  $$(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>$(".desktop-nav").classList.remove("open")));
  $("#adminEntry").addEventListener("click",showAdmin);
  $("#closeAdmin").addEventListener("click",closeAdmin);
  $("#adminModal").addEventListener("click",e=>{if(e.target===$("#adminModal"))closeAdmin();});
  $("#loginForm").addEventListener("submit",e=>{e.preventDefault();if($("#adminPassword").value===CONFIG.demoAdminPassword){$("#loginView").classList.add("hidden");$("#adminView").classList.remove("hidden");renderAdminProducts();}else{$("#loginError").textContent="Contraseña incorrecta. Inténtalo nuevamente."; }});
  $("#logoutButton").addEventListener("click",()=>{resetProductForm();showAdmin();});
  $$(".admin-tab").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
  $("#newProductButton").addEventListener("click",()=>openProductForm());
  $("#cancelProduct").addEventListener("click",resetProductForm);
  $("#adminProductList").addEventListener("click",e=>{
    const edit=e.target.closest("[data-edit]"),copy=e.target.closest("[data-copy]"),del=e.target.closest("[data-delete]");
    if(edit){openProductForm(products.find(p=>p.id===edit.dataset.edit));}
    if(copy){const p=products.find(x=>x.id===copy.dataset.copy);if(p){const duplicate={...clone(p),id:crypto.randomUUID(),code:p.code?`${p.code}-COPIA`:""};products.unshift(duplicate);save(STORAGE.products,products);renderAdminProducts();refreshCategoryOptions();renderProducts();notify("Producto duplicado.");}}
    if(del){if(confirm("¿Eliminar este producto del catálogo?")){products=products.filter(p=>p.id!==del.dataset.delete);save(STORAGE.products,products);renderAdminProducts();refreshCategoryOptions();renderProducts();notify("Producto eliminado.");}}
  });
  $("#productForm").addEventListener("submit",e=>{
    e.preventDefault();
    const id=$("#productId").value||crypto.randomUUID();
    const item={id,code:$("#productCode").value.trim(),name:$("#productName").value.trim(),category:$("#productCategory").value,brand:$("#productBrand").value.trim(),price:$("#productPrice").value===""?null:Number($("#productPrice").value),status:$("#productStatus").value,image:$("#productImage").value.trim(),description:$("#productDescription").value.trim(),specs:$("#productSpecs").value.trim(),featured:$("#productFeatured").checked,published:$("#productPublished").checked};
    const index=products.findIndex(p=>p.id===id);if(index>=0)products[index]=item;else products.unshift(item);
    save(STORAGE.products,products);resetProductForm();renderAdminProducts();refreshCategoryOptions();renderProducts();notify("Producto guardado correctamente.");
  });
  $("#settingsForm").addEventListener("submit",e=>{
    e.preventDefault();
    settings={whatsapp:$("#settingWhatsApp").value.trim(),facebook:$("#settingFacebook").value.trim(),instagram:$("#settingInstagram").value.trim()};
    save(STORAGE.settings,settings);applyContactLinks();notify("Configuración guardada.");
  });
}
function init() {
  $("#year").textContent=new Date().getFullYear();
  $("#settingWhatsApp").value=settings.whatsapp||"";
  $("#settingFacebook").value=settings.facebook||"";
  $("#settingInstagram").value=settings.instagram||"";
  refreshCategoryOptions();applyContactLinks();renderProducts();setupEvents();
}
init();
