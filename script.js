let products=[];
let cart=JSON.parse(localStorage.getItem('qaraqalpagim_cart')||'[]');
let active='Все';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const fmt=n=>new Intl.NumberFormat('ru-RU').format(n)+' сум';

fetch('menu.json').then(r=>r.json()).then(data=>{products=data; renderCats(); render(); drawCart();});

function renderCats(){
  const cats=['Все',...new Set(products.map(x=>x.category))];
  $('#cats').innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}" onclick="setCat('${escapeHtml(c)}')">${c}</button>`).join('');
}
function setCat(c){active=c;renderCats();render();}
function escapeHtml(s){return s.replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
function render(){
  const q=$('#search').value.trim().toLowerCase();
  const f=products.filter(x=>(active==='Все'||x.category===active)&&(!q||(x.name+' '+x.description).toLowerCase().includes(q)));
  $('#resultCount').textContent=`${f.length} ${f.length===1?'блюдо':f.length<5?'блюда':'блюд'}`;
  $('#grid').innerHTML=f.length?f.map(x=>{const i=products.indexOf(x);return `<article class="menu-card" onclick="openProduct(${i})"><div class="card-top"><span>${escapeHtml(x.category)}</span><button class="add-btn" onclick="event.stopPropagation();add(${i})" aria-label="Добавить">+</button></div><h3>${escapeHtml(x.name)}</h3><p>${escapeHtml(x.description)}</p><div class="card-bottom"><b>${fmt(x.price)}</b><small>от 1 порции</small></div></article>`}).join(''):`<div class="empty-state"><b>Ничего не нашли</b><span>Попробуйте другой запрос или сбросьте фильтры.</span></div>`;
}
$('#search').addEventListener('input',render);
$('#clearFilters').onclick=()=>{$('#search').value='';active='Все';renderCats();render()};
function add(i){const p=products[i], x=cart.find(a=>a.name===p.name); x?x.qty++:cart.push({...p,qty:1}); save(); toast('Добавлено в корзину');}
function save(){localStorage.setItem('qaraqalpagim_cart',JSON.stringify(cart));drawCart()}
function drawCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0), total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  $('#cartCount').textContent=count;$('#cartItemsCount').textContent=count;$('#sum').textContent=fmt(total);
  $('#cartItems').innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><div><b>${escapeHtml(x.name)}</b><small>${fmt(x.price)}</small><div class="qty"><button onclick="qty(${i},-1)">−</button><span>${x.qty}</span><button onclick="qty(${i},1)">+</button></div></div><strong>${fmt(x.price*x.qty)}</strong></div>`).join(''):`<div class="empty-cart"><b>Корзина пуста</b><span>Добавьте блюда из меню.</span></div>`;
  $('#deliverySummary').innerHTML=cart.length?`В заказе <b>${count}</b> поз. · <b>${fmt(total)}</b>`:'Корзина пуста';
}
function qty(i,n){cart[i].qty+=n;if(cart[i].qty<1)cart.splice(i,1);save()}
function openProduct(i){const p=products[i];$('#pCat').textContent=p.category;$('#pName').textContent=p.name;$('#pDesc').textContent=p.description;$('#pPrice').textContent=fmt(p.price);$('#pAdd').onclick=()=>{add(i);closeAll()};$('#productModal').classList.add('open')}
function openCart(){ $('#cartPanel').classList.add('open') }
function openDelivery(){ $('#deliveryModal').classList.add('open'); loadDelivery() }
function openReserve(){ $('#reserveModal').classList.add('open'); setupReservation() }
function closeAll(){ $$('.modal,.drawer').forEach(x=>x.classList.remove('open')) }
$$('[data-close]').forEach(x=>x.onclick=closeAll);
$('#cartPanel').addEventListener('click',e=>e.stopPropagation());
$('#headerDeliveryBtn').onclick=openCart; $('#quickOrder')?.addEventListener('click',openCart);
$('#reserveBtn').onclick=openReserve;$('#heroReserveBtn').onclick=openReserve;
$('#serviceDelivery').onclick=openDelivery;$('#serviceReserve').onclick=openReserve;$('#serviceCart').onclick=openCart;
$('#menuBtn').onclick=()=>$('#drawer').classList.add('open');
$('#drawerDelivery').onclick=()=>{closeAll();openDelivery()};$('#drawerReserve').onclick=()=>{closeAll();openReserve()};
$('#closeCart').onclick=()=>$('#cartPanel').classList.remove('open');
$('#checkout').onclick=()=>{if(!cart.length)return toast('Добавьте блюда в корзину');openDelivery()};
$('#clearCart').onclick=()=>{cart=[];save();toast('Корзина очищена')};
$('#saveDelivery').onclick=saveDelivery;
$('#saveReservation').onclick=saveReservation;
function loadDelivery(){const d=JSON.parse(localStorage.getItem('qaraqalpagim_delivery')||'{}');['Name','Phone','Address','Comment'].forEach(k=>{const el=$('#d'+k);if(el)el.value=d[k.toLowerCase()]||''})}
function saveDelivery(){
  const name=$('#dName').value.trim(),phone=$('#dPhone').value.trim(),address=$('#dAddress').value.trim();
  if(!name||!phone||!address)return toast('Заполните имя, телефон и адрес');
  localStorage.setItem('qaraqalpagim_delivery',JSON.stringify({name,phone,address,comment:$('#dComment').value.trim()}));
  cart=[];save();closeAll();$('#cartPanel').classList.remove('open');toast('Доставка оформлена в демо-режиме');
}
function setupReservation(){
  const today=new Date(); const iso=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  $('#rDate').min=iso;if(!$('#rDate').value)$('#rDate').value=iso;
  const times=[];for(let h=10;h<=22;h++){times.push(`${String(h).padStart(2,'0')}:00`,`${String(h).padStart(2,'0')}:30`)}$('#rTime').innerHTML=times.map(t=>`<option>${t}</option>`).join('');
  const r=JSON.parse(localStorage.getItem('qaraqalpagim_reservation')||'{}');['Name','Phone','Guests','Date','Time','Comment'].forEach(k=>{const el=$('#r'+k);if(el&&r[k.toLowerCase()])el.value=r[k.toLowerCase()]});
}
function saveReservation(){
  const name=$('#rName').value.trim(),phone=$('#rPhone').value.trim(),guests=$('#rGuests').value,date=$('#rDate').value,time=$('#rTime').value;
  if(!name||!phone||!guests||!date||!time)return toast('Заполните имя, телефон, дату, время и гостей');
  localStorage.setItem('qaraqalpagim_reservation',JSON.stringify({name,phone,guests,date,time,comment:$('#rComment').value.trim()}));closeAll();toast(`Стол на ${guests} ${guests==='1'?'гостя':'гостей'} забронирован`)
}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.classList.remove('show'),2200)}
drawCart();
