const form = document.getElementById('purchase-form');

function showError(fieldId, message) {
  const el = document.getElementById('error-' + fieldId);
  const input = document.getElementById(fieldId);
  if (el) el.textContent = message;
  if (input) input.classList.add('invalid');
  if (input) input.classList.remove('valid');
}

function clearError(fieldId) {
  const el = document.getElementById('error-' + fieldId);
  const input = document.getElementById(fieldId);
  if (el) el.textContent = '';
  if (input) input.classList.remove('invalid');
  if (input) input.classList.add('valid');
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validateField(fieldId) {
  const value = (document.getElementById(fieldId)?.value || '').trim();
  switch (fieldId) {
    case 'nama':
      if (!value) { showError('nama', '⚠ Nama lengkap tidak boleh kosong.'); return false; }
      if (value.length < 3) { showError('nama', '⚠ Nama minimal 3 karakter.'); return false; }
      clearError('nama'); return true;

    case 'email':
      if (!value) { showError('email', '⚠ Email tidak boleh kosong.'); return false; }
      if (!isValidEmail(value)) { showError('email', '⚠ Format email tidak valid. Contoh: nama@domain.com'); return false; }
      clearError('email'); return true;

    case 'telepon':
      if (!value) { showError('telepon', '⚠ Nomor telepon tidak boleh kosong.'); return false; }
      if (isNaN(value) || Number(value) <= 0) { showError('telepon', '⚠ Nomor telepon harus berupa angka positif.'); return false; }
      if (String(value).length < 10) { showError('telepon', '⚠ Nomor telepon minimal 10 digit.'); return false; }
      clearError('telepon'); return true;

    case 'password':
      if (!value) { showError('password', '⚠ Password tidak boleh kosong.'); return false; }
      if (value.length < 8) { showError('password', '⚠ Password minimal 8 karakter.'); return false; }
      clearError('password'); return true;

    case 'produk-pilihan':
      if (!value) { showError('produk-pilihan', '⚠ Silakan pilih treatment.'); return false; }
      clearError('produk-pilihan'); return true;

    case 'jumlah':
      if (!value) { showError('jumlah', '⚠ Jumlah pesanan tidak boleh kosong.'); return false; }
      const qty = Number(value);
      if (isNaN(qty) || qty <= 0) { showError('jumlah', '⚠ Jumlah harus berupa angka positif.'); return false; }
      if (qty > 99) { showError('jumlah', '⚠ Maksimal pemesanan 99 item.'); return false; }
      clearError('jumlah'); return true;

    default: return true;
  }
}

function validateRadio() {
  const radios = document.querySelectorAll('input[name="pembayaran"]');
  const selected = Array.from(radios).some(r => r.checked);
  if (!selected) {
    document.getElementById('error-pembayaran').textContent = '⚠ Pilih metode pembayaran.';
    return false;
  }
  document.getElementById('error-pembayaran').textContent = '';
  return true;
}

function validateCheckbox() {
  const cb = document.getElementById('setuju');
  if (!cb.checked) {
    document.getElementById('error-setuju').textContent = '⚠ Anda harus menyetujui syarat dan ketentuan.';
    return false;
  }
  document.getElementById('error-setuju').textContent = '';
  return true;
}

['nama', 'email', 'telepon', 'password', 'produk-pilihan', 'jumlah'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {

      if (el.classList.contains('invalid')) validateField(id);
    });
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const fields = ['nama', 'email', 'telepon', 'password', 'produk-pilihan', 'jumlah'];
  const results = fields.map(id => validateField(id));
  const radioOk = validateRadio();
  const cbOk = validateCheckbox();

  const allValid = results.every(Boolean) && radioOk && cbOk;

  if (allValid) {

    const toast = document.getElementById('success-toast');
    toast.classList.remove('hidden');
    form.reset();

    document.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
    setTimeout(() => toast.classList.add('hidden'), 5000);
    toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {

    const firstError = form.querySelector('.invalid, .error-msg:not(:empty)');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

const toggleBtn = document.getElementById('toggle-pw');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const pwInput = document.getElementById('password');
    if (pwInput.type === 'password') {
      pwInput.type = 'text';
      toggleBtn.textContent = '🙈';
    } else {
      pwInput.type = 'password';
      toggleBtn.textContent = '👁';
    }
  });
}


let products = [
  { id: 1, name: 'Brightening Facial Glow', kategori: 'Facial', harga: 150000, stok: 20, emoji: '💆‍♀️' },
  { id: 2, name: 'Skin Rejuvenation Laser', kategori: 'Laser', harga: 350000, stok: 15, emoji: '✨' },
  { id: 3, name: 'Premium Facial & Spa',       kategori: 'Spa', harga: 250000, stok: 18, emoji: '🧖‍♀️' },
  { id: 4, name: 'Acne Treatment', kategori: 'Acne Care',   harga: 200000, stok: 25, emoji: '🌿' },
  { id: 5, name: 'Whitening Booster Treatment', kategori: 'Whitening', harga: 300000, stok: 10, emoji: '🤍' }
];

let nextId = 6;

// Emoji map by kategori
const emojiMap = {
  Facial:     '💆‍♀️',
  Laser:      '✨',
  Spa:        '🧖‍♀️',
  Acne Care:  '🌿',
  Whitening:  ' 🤍 ',
};

// Format harga
function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

// SOAL 5: Render items to DOM
function renderCatalog() {
  const list = document.getElementById('catalog-list');
  const empty = document.getElementById('catalog-empty');
  list.innerHTML = '';

  if (products.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  products.forEach((product, index) => {
    const item = document.createElement('div');
    item.classList.add('catalog-item');
    item.setAttribute('data-id', product.id);
    item.style.animationDelay = (index * 0.05) + 's';

    item.innerHTML = `
      <div class="catalog-item-emoji">${product.emoji}</div>
      <div class="catalog-item-info">
        <div class="catalog-item-name">${escapeHtml(product.name)}</div>
        <div class="catalog-item-meta">
          <span>🏷 ${escapeHtml(product.kategori)}</span>
          <span>📦 Stok: ${product.stok}</span>
        </div>
      </div>
      <span class="catalog-item-badge">${escapeHtml(product.kategori)}</span>
      <div class="catalog-item-price">${formatRupiah(product.harga)}</div>
      <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑 Hapus</button>
    `;

    list.appendChild(item);
  });
}

document.getElementById('btn-add-product').addEventListener('click', () => {
  const namaInput  = document.getElementById('add-nama');
  const hargaInput = document.getElementById('add-harga');
  const stokInput  = document.getElementById('add-stok');
  const katInput   = document.getElementById('add-kategori');

  let valid = true;

  if (!namaInput.value.trim()) {
    document.getElementById('error-add-nama').textContent = '⚠ Nama treatment tidak boleh kosong.';
    namaInput.classList.add('invalid');
    valid = false;
  } else {
    document.getElementById('error-add-nama').textContent = '';
    namaInput.classList.remove('invalid');
  }

  const harga = Number(hargaInput.value);
  if (!hargaInput.value || isNaN(harga) || harga <= 0) {
    document.getElementById('error-add-harga').textContent = '⚠ Harga harus berupa angka positif.';
    hargaInput.classList.add('invalid');
    valid = false;
  } else {
    document.getElementById('error-add-harga').textContent = '';
    hargaInput.classList.remove('invalid');
  }

  const stok = Number(stokInput.value);
  if (!stokInput.value || isNaN(stok) || stok <= 0) {
    document.getElementById('error-add-stok').textContent = '⚠ Stok harus berupa angka positif.';
    stokInput.classList.add('invalid');
    valid = false;
  } else {
    document.getElementById('error-add-stok').textContent = '';
    stokInput.classList.remove('invalid');
  }

  if (!valid) return;

  const kategori = katInput.value;
  const newProduct = {
    id:       nextId++,
    name:     namaInput.value.trim(),
    kategori: kategori,
    harga:    harga,
    stok:     stok,
    emoji:    emojiMap[kategori] || '👕',
  };

  products.push(newProduct);

  namaInput.value  = '';
  hargaInput.value = '';
  stokInput.value  = '';

  renderCatalog();

  const lastItem = document.getElementById('catalog-list').lastElementChild;
  if (lastItem) lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

function deleteProduct(id) {
  const item = document.querySelector('[data-id="${id}"]');
  if (item) {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    item.style.opacity = '0';
    item.style.transform = 'translateX(24px)';
    setTimeout(() => {
      products = products.filter(p => p.id !== id);
      renderCatalog();
    }, 300);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.nav-link[href="#${id}"]');
      if (active) active.classList.add('active');
    }
  });
}, { passive: true });

renderCatalog();