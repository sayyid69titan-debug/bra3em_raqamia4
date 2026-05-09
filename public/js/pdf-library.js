let pdfFilesCache = [];

function renderPdfLibrary(files) {
  const list = document.getElementById('pdfLibraryList');
  const status = document.getElementById('pdfLibraryStatus');
  if (!list || !status) return;
  list.innerHTML = '';
  if (!files.length) {
    status.textContent = 'لا توجد ملفات مطابقة للبحث الحالي.';
    return;
  }
  status.textContent = `تم العثور على ${files.length} ملف. اختر ملفًا للمعاينة أو التحميل:`;
  files.forEach((file) => {
    const row = document.createElement('article');
    row.className = 'pdf-link';
    row.innerHTML = `
      <div>
        <strong>${file.name}</strong>
        <small>ملف داعم يمكن معاينته داخل المنصة</small>
      </div>
      <div class="pdf-row-actions">
        <button class="btn secondary small" type="button" data-preview="${file.url}">معاينة</button>
        <a class="btn primary small" href="${file.url}" target="_blank" rel="noopener">فتح</a>
      </div>`;
    list.appendChild(row);
  });
}

function filterPdfLibrary() {
  const query = (document.getElementById('pdfSearch')?.value || '').trim().toLowerCase();
  const grade = document.getElementById('pdfGradeFilter')?.value || '';
  const filtered = pdfFilesCache.filter(file => {
    const name = file.name.toLowerCase();
    return (!query || name.includes(query)) && (!grade || file.name.includes(grade));
  });
  renderPdfLibrary(filtered);
}

async function loadPdfLibrary() {
  const list = document.getElementById('pdfLibraryList');
  const status = document.getElementById('pdfLibraryStatus');
  if (!list || !status) return;
  list.innerHTML = '';
  status.textContent = 'جارٍ تحميل ملفات PDF...';
  try {
    const res = await fetch('/api/pdfs');
    if (!res.ok) throw new Error('network');
    pdfFilesCache = await res.json();
    if (!pdfFilesCache.length) {
      status.textContent = 'لا توجد ملفات PDF بعد. أضف ملفاتك داخل public/pdfs وستظهر هنا تلقائيًا.';
      return;
    }
   filterPdfLibrary();
  } 
}

(function initPdfLibrary() {
  const trigger = document.getElementById('pdfLibraryToggle');
  const modal = document.getElementById('pdfLibraryModal');
  if (!trigger || !modal) return;

  const closeBtn = modal.querySelector('[data-close-pdf]');
  const preview = document.getElementById('pdfPreview');
  const search = document.getElementById('pdfSearch');
  const filter = document.getElementById('pdfGradeFilter');
  const openModal = () => {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    loadPdfLibrary();
  };
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (preview) preview.removeAttribute('src');
  };

  trigger.addEventListener('click', openModal);
  search && search.addEventListener('input', filterPdfLibrary);
  filter && filter.addEventListener('change', filterPdfLibrary);
  modal.addEventListener('click', (e) => {
    const previewBtn = e.target.closest('[data-preview]');
    if (previewBtn && preview) {
      preview.src = previewBtn.dataset.preview;
      preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
