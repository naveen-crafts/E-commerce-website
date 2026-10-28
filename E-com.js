'use strict';

const PRODUCTS = [
  { id: 1,  name: 'COOLMAX® Regular Fit Shirt, Black', price: 1499, old: 1999, cat: 'men',   img: 'shirt-black' },
  { id: 2,  name: 'Lyocell Resort Shirt',               price: 1499, old: 1999, cat: 'men',   img: 'shirt-floral', tag: 'New' },
  { id: 3,  name: 'Relaxed Fit Hoodie, Purple',         price: 1499, old: 2199, cat: 'men',   img: 'hoodie-purple' },
  { id: 4,  name: 'Regular Fit Linen-blend Shirt',      price: 1499, old: 1899, cat: 'men',   img: 'shirt-striped' },
  { id: 5,  name: 'Polo Shirt, Slim Fit',               price: 1799, old: 2299, cat: 'men',   img: 'polo-pink' },
  { id: 6,  name: 'Relaxed Fit Hoodie, Lilac',          price: 1499, old: 2199, cat: 'men',   img: 'hoodie-lilac', tag: 'New' },
  { id: 7,  name: 'Ribbed Cut-out Top, Dark Brown',     price: 799,  old: 1199, cat: 'women', img: 'top-brown' },
  { id: 8,  name: 'Single-breasted Jacket',             price: 2499, old: 3299, cat: 'women', img: 'blazer-beige' },
  { id: 9,  name: 'Boyfriend Low Regular Jeans',        price: 2699, old: 3499, cat: 'women', img: 'jeans-denim' },
  { id: 10, name: 'Balloon-sleeved Cut-out Crêpe Dress', price: 2699, old: 3499, cat: 'women', img: 'dress-black' },
  { id: 11, name: 'Patterned Long Skirt',               price: 1599, old: 2099, cat: 'women', img: 'skirt-blue', tag: 'New' },
  { id: 12, name: 'Tie-belt Jumpsuit',                  price: 2199, old: 2899, cat: 'women', img: 'jumpsuit-black', tag: 'New' }
];

const $ = (s) => document.querySelector(s);
const inr = (n) => '₹' + n.toLocaleString('en-IN');
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
};

const state = {
  cat: 'all', q: '', sort: 'default',
  cart: store.get('nk_cart', []).filter(i => PRODUCTS.some(p => p.id === i.id) && i.qty > 0),
  wish: store.get('nk_wish', [])
};

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- products ---------- */
function visible() {
  let list = PRODUCTS.filter(p =>
    (state.cat === 'all' || p.cat === state.cat) &&
    p.name.toLowerCase().includes(state.q));
  if (state.sort === 'low') list.sort((a, b) => a.price - b.price);
  if (state.sort === 'high') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderProducts() {
  const list = visible();
  $('#empty').hidden = list.length > 0;
  $('#grid').innerHTML = list.map(p => `
    <article class="card reveal">
      <div class="img">
        <img src="images/${p.img}.webp" alt="${p.name}" width="320" height="480" loading="lazy">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
        <span class="tag off">−${Math.round((1 - p.price / p.old) * 100)}%</span>
        <button class="wish ${state.wish.includes(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist"><i class="fas fa-heart"></i></button>
      </div>
      <div class="info">
        <h4>${p.name}</h4>
        <div class="price">${inr(p.price)}<s>${inr(p.old)}</s></div>
        <button class="add" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`).join('');
  observeReveal();
}

/* ---------- cart ---------- */
const saveCart = () => store.set('nk_cart', state.cart);
const FREE_SHIP = 1999;
state.coupon = store.get('nk_coupon', '') === 'NK10' ? 'NK10' : '';

function renderCart() {
  const box = $('#cartItems');
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const total = state.cart.reduce((s, i) => s + i.qty * PRODUCTS.find(p => p.id === i.id).price, 0);
  $('#cartCount').textContent = count;
  const disc = state.coupon ? Math.round(total * 0.1) : 0;
  $('#cartSub').textContent = inr(total);
  $('#discRow').hidden = !disc;
  $('#cartDisc').textContent = '−' + inr(disc);
  $('#cartTotal').textContent = inr(total - disc);
  const left = FREE_SHIP - (total - disc);
  $('#shipMsg').textContent = !total ? '' : left > 0 ? `Add ${inr(left)} more for free shipping` : '🎉 You get free shipping!';
  $('#shipBar').style.width = Math.min(100, ((total - disc) / FREE_SHIP) * 100) + '%';
  box.innerHTML = state.cart.length ? state.cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return `<div class="ci">
      <img src="images/${p.img}.webp" alt="">
      <div class="ci-info">
        <strong>${p.name}</strong><div>${inr(p.price)}</div>
        <div class="qty">
          <button data-dec="${p.id}" aria-label="Decrease quantity">−</button>
          <span>${i.qty}</span>
          <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
          <button class="rm" data-rm="${p.id}" aria-label="Remove item"><i class="fas fa-trash"></i></button>
        </div>
      </div></div>`;
  }).join('') : '<p class="cart-empty">Your cart is empty.</p>';
}

function addToCart(id) {
  const item = state.cart.find(i => i.id === id);
  item ? item.qty++ : state.cart.push({ id, qty: 1 });
  saveCart(); renderCart();
  toast('Added to cart');
}

function changeQty(id, d) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
  saveCart(); renderCart();
}

function toggleCart(open) {
  $('#drawer').classList.toggle('open', open);
  $('#drawer').setAttribute('aria-hidden', String(!open));
  $('#overlay').classList.toggle('show', open);
}

/* ---------- events ---------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  const d = t.dataset;
  if (d.add) addToCart(+d.add);
  if (d.inc) changeQty(+d.inc, 1);
  if (d.dec) changeQty(+d.dec, -1);
  if (d.rm) { state.cart = state.cart.filter(i => i.id !== +d.rm); saveCart(); renderCart(); }
  if (d.wish) {
    const id = +d.wish;
    state.wish = state.wish.includes(id) ? state.wish.filter(x => x !== id) : [...state.wish, id];
    store.set('nk_wish', state.wish);
    t.classList.toggle('on', state.wish.includes(id));
    toast(state.wish.includes(id) ? 'Added to wishlist' : 'Removed from wishlist');
  }
  if (d.cat) {
    state.cat = d.cat;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === t));
    renderProducts();
  }
});

$('#search').addEventListener('input', (e) => { state.q = e.target.value.trim().toLowerCase(); renderProducts(); });
$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderProducts(); });
$('#cartBtn').addEventListener('click', () => toggleCart(true));
$('#closeCart').addEventListener('click', () => toggleCart(false));
$('#overlay').addEventListener('click', () => toggleCart(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleCart(false); });
$('#clearCart').addEventListener('click', () => { state.cart = []; saveCart(); renderCart(); });
$('#checkout').addEventListener('click', () => {
  if (!state.cart.length) return toast('Your cart is empty');
  toast('Demo store: checkout is not connected yet');
});

$('#couponForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const code = $('#couponInput').value.trim().toUpperCase();
  if (code === 'NK10') { state.coupon = 'NK10'; store.set('nk_coupon', 'NK10'); renderCart(); toast('Coupon applied: 10% off'); }
  else toast('Invalid coupon code');
  $('#couponInput').value = '';
});

/* mobile menu */
const menuBtn = $('#menuBtn'), navbar = $('#navbar');
menuBtn.addEventListener('click', () => {
  const open = navbar.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.firstElementChild.className = open ? 'fas fa-times' : 'fas fa-bars';
});
navbar.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') { navbar.classList.remove('open'); menuBtn.firstElementChild.className = 'fas fa-bars'; }
});

/* dark mode */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#themeBtn').firstElementChild.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  store.set('nk_theme', t);
}
setTheme(store.get('nk_theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
$('#themeBtn').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

/* newsletter */
$('#newsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#email'), msg = $('#formMsg');
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    msg.textContent = 'Thanks for subscribing!';
    email.value = '';
  } else {
    msg.textContent = 'Please enter a valid email address.';
  }
});

/* back to top + scroll reveal */
const links = [...document.querySelectorAll('.navbar a')];
const secs = links.map(a => document.querySelector(a.getAttribute('href')));
addEventListener('scroll', () => {
  $('#toTop').classList.toggle('show', scrollY > 600);
  $('.nav').classList.toggle('scrolled', scrollY > 10);
  let cur = 0;
  secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === cur));
}, { passive: true });
$('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((es) => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1 })
  : null;
function observeReveal() {
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));
}

renderProducts();
renderCart();
