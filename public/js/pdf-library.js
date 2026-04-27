const STATIC_PDFS = [
  ['الصف الأول.pdf', '#U0627#U0644#U0635#U0641 #U0627#U0644#U0623#U0648#U0644.pdf'],
  ['الصف الثاني.pdf', '#U0627#U0644#U0635#U0641 #U0627#U0644#U062b#U0627#U0646#U064a.pdf'],
  ['الصف الثالث.pdf', '#U0627#U0644#U0635#U0641 #U0627#U0644#U062b#U0627#U0644#U062b.pdf'],
  ['الصف الرابع.pdf', '#U0627#U0644#U0635#U0641 #U0627#U0644#U0631#U0627#U0628#U0639.pdf'],
  ['الصف الخامس.pdf', '#U0627#U0644#U0635#U0641 #U0627#U0644#U062e#U0627#U0645#U0633.pdf'],
  ['الصف السادس.pdf', '#U0627#U0644#U0635#U0641 #U0627#U0644#U0633#U0627#U062f#U0633.pdf']
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
    a.href = `/pdfs/${encodeURIComponent(fileName)}`;
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
