/* ─── TAB SWITCHING ─── */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

/* ─── WISHLIST TOGGLE ─── */
document.querySelectorAll('.wish-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.toggle('active');
    const svg = btn.querySelector('path');
    if (btn.classList.contains('active')) {
      svg.setAttribute('fill', '#e33');
      svg.setAttribute('stroke', '#e33');
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
    }
  });
});

/* ─── SEARCH ─── */
const searchInput = document.querySelector('.search-wrap input');
const searchBtn   = document.querySelector('.search-btn');

function doSearch() {
  const q = searchInput.value.trim();
  if (q) console.log('검색:', q);
}

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

/* ─── HEADER SCROLL SHADOW ─── */
window.addEventListener('scroll', () => {
  document.getElementById('header').style.boxShadow =
    window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.08)' : 'none';
});
