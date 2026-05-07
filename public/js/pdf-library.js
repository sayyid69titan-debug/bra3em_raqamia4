const STATIC_PDFS = [
   ['الصف الأول.pdf', 'الصف الأول.pdf'],
  ['الصف الثاني.pdf', 'الصف الثاني.pdf'],
  ['الصف الثالث.pdf', 'الصف الثالث.pdf'],
  ['الصف الرابع.pdf', 'الصف الرابع.pdf'],
  ['الصف الخامس.pdf', 'الصف الخامس.pdf'],
  ['الصف السادس.pdf', 'الصف السادس.pdf']
];

async function loadPdfLibrary() {
  const list = document.getElementById('pdfLibraryList');
  const status = document.getElementById('pdfLibraryStatus');
  if (!list || !status) return;
  list.innerHTML = '';
  status.textContent = 'اختر ملفًا لفتحه:';
  STATIC_PDFS.forEach(([displayName, fileName]) => {
    const a = document.createElement('a');
    a.className = 'pdf-link';
   a.href = `/pdfs/${fileName}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = displayName;
    list.appendChild(a);
  });
}

(function initPdfLibrary() {
  const trigger = document.getElementById('pdfLibraryToggle');
  const modal = document.getElementById('pdfLibraryModal');
  if (!trigger || !modal) return;
  const closeBtn = modal.querySelector('[data-close-pdf]');
  const openModal = () => { modal.classList.add('open'); document.body.classList.add('modal-open'); loadPdfLibrary(); };
  const closeModal = () => { modal.classList.remove('open'); document.body.classList.remove('modal-open'); };
  trigger.addEventListener('click', openModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
})();
