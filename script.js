let pages=[],idx=0;const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
fetch('gallery.json').then(r=>r.json()).then(d=>{pages=d;renderThumbs();show(0)});
function show(i){idx=(i+pages.length)%pages.length;$('#menuImage').src=pages[idx].src;$('#pageLabel').textContent=(idx+1)+' / '+pages.length;$$('.thumbs img').forEach((x,n)=>x.classList.toggle('active',n===idx))}
function renderThumbs(){$('#thumbs').innerHTML=pages.map((p,i)=>`<img src="${p.src}" onclick="show(${i})" ${i===0?'class="active"':''}>`).join('')}
$('#prev').onclick=$('#vPrev').onclick=()=>show(idx-1);$('#next').onclick=$('#vNext').onclick=()=>show(idx+1);$('#zoom').onclick=()=>{$('#lightImage').src=pages[idx].src;$('#lightbox').classList.add('open')};
$('#menuBtn').onclick=()=>$('#drawer').classList.add('open');$('#reserveBtn').onclick=$('#drawerReserve').onclick=()=>$('#reserveModal').classList.add('open');$('#sendReserve').onclick=()=>{closeAll();toast('Заявка отправлена — мы свяжемся с вами')};
$$('[data-close]').forEach(x=>x.onclick=closeAll);$('.lightbox').onclick=e=>{if(e.target===$('#lightbox'))closeAll()};
function closeAll(){$$('.modal,.drawer,.lightbox').forEach(x=>x.classList.remove('open'))}function toast(t){let e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
const translations = {
    kk: {
        title: "ҚАРАҚАЛПАҒЫМ",
        menuHeading: "Menyu"
    },
    ru: {
        title: "КАРАКАЛПАКСТАН",
        menuHeading: "Меню"
    },
    en: {
        title: "QARAQALPAGIM",
        menuHeading: "Menu"
    },
    uz: {
        title: "QORAQALPOG'IM",
        menuHeading: "Menyu"
    }
};

// Placeholder data since menu.json was unreadable
const fallbackMenuData = [
    { name: "Beshbarmak", price: "45,000 UZS" },
    { name: "Kuyrdak", price: "35,000 UZS" },
    { name: "Shubat", price: "15,000 UZS" },
    { name: "Baursak", price: "10,000 UZS" }
];

const langSwitch = document.getElementById('lang-switch');
const titleText = document.getElementById('title-text');
const menuHeading = document.getElementById('menu-heading');
const menuContainer = document.getElementById('menu-container');

function updateLanguage(lang) {
    titleText.textContent = translations[lang].title;
    menuHeading.textContent = translations[lang].menuHeading;
}

function renderMenu(menuItems) {
    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = item.name;
        
        const priceSpan = document.createElement('span');
        priceSpan.className = 'item-price';
        priceSpan.textContent = item.price;
        
        div.appendChild(nameSpan);
        div.appendChild(priceSpan);
        menuContainer.appendChild(div);
    });
}

langSwitch.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// Attempt to fetch local menu.json, fallback to hardcoded data if it fails
fetch('menu.json')
    .then(response => response.json())
    .then(data => renderMenu(data))
    .catch(error => {
        console.log("Could not load menu.json, using fallback data.");
        renderMenu(fallbackMenuData);
    });
