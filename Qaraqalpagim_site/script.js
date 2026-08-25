let pages=[],idx=0;const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
fetch('gallery.json').then(r=>r.json()).then(d=>{pages=d;renderThumbs();show(0)});
function show(i){idx=(i+pages.length)%pages.length;$('#menuImage').src=pages[idx].src;$('#pageLabel').textContent=(idx+1)+' / '+pages.length;$$('.thumbs img').forEach((x,n)=>x.classList.toggle('active',n===idx))}
function renderThumbs(){$('#thumbs').innerHTML=pages.map((p,i)=>`<img src="${p.src}" onclick="show(${i})" ${i===0?'class="active"':''}>`).join('')}
$('#prev').onclick=$('#vPrev').onclick=()=>show(idx-1);$('#next').onclick=$('#vNext').onclick=()=>show(idx+1);$('#zoom').onclick=()=>{$('#lightImage').src=pages[idx].src;$('#lightbox').classList.add('open')};
$('#menuBtn').onclick=()=>$('#drawer').classList.add('open');$('#reserveBtn').onclick=$('#drawerReserve').onclick=()=>$('#reserveModal').classList.add('open');$('#sendReserve').onclick=()=>{closeAll();toast('Заявка отправлена — мы свяжемся с вами')};
$$('[data-close]').forEach(x=>x.onclick=closeAll);$('.lightbox').onclick=e=>{if(e.target===$('#lightbox'))closeAll()};
function closeAll(){$$('.modal,.drawer,.lightbox').forEach(x=>x.classList.remove('open'))}function toast(t){let e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
