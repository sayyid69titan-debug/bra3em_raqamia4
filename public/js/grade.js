const data = window.BARAEM_CONTENT;
const id = +document.body.dataset.grade;
const g = data.grades.find(x => x.id === id);

if (!g) throw new Error('Grade data not found');

document.documentElement.style.setProperty('--grade-accent', g.accent);
document.getElementById('gradeTitle').textContent = g.title;
document.getElementById('gradeHeroTitle').textContent = g.hero;
document.getElementById('gradeBadge').textContent = g.source;
document.getElementById('gradeStage').textContent = id <= 2 ? 'مرحلة التأسيس' : id <= 4 ? 'مرحلة المنطق والخوارزميات' : 'مرحلة النمذجة والابتكار';
document.getElementById('heroImg').src = `assets/grade-${g.id}-hero.png`;
document.getElementById('heroImg').classList.add('zoomable-image');
document.getElementById('gradeLead').textContent = g.overview[0];
document.getElementById('goalCardText').textContent = g.units[0]?.name.replace('الوحدة 1: ', '') || g.hero;
document.getElementById('resultCardText').textContent = `${g.games.length} ألعاب + ${g.activities.length} نشاطًا`;

document.getElementById('nextStepText').textContent = id < 6 ? `بعد إنهاء هذا الصف يمكنك الانتقال مباشرة إلى ${data.grades.find(x => x.id === id + 1).title}.` : 'يمكنك الآن الرجوع إلى الرئيسية أو استكشاف قسم البرمجة لاستكمال الرحلة.';
const footerActions = document.getElementById('gradeFooterActions');
footerActions.innerHTML = id < 6
  ? `<a class="btn primary large" href="grade-${id + 1}.html">انتقل إلى الصف التالي</a><a class="btn secondary large" href="index.html">العودة للرئيسية</a>`
  : `<a class="btn primary large" href="programming.html">استكشف قسم البرمجة</a><a class="btn secondary large" href="index.html">العودة للرئيسية</a>`;

const stats = document.getElementById('gradeStats');
[[`${g.units.length}`, 'وحدات مختصرة'], [`${g.activities.length}`, 'نشاطًا تعليميًا'], [`${g.games.length}`, 'ألعاب تفاعلية']].forEach(([num, label]) => {
  const item = document.createElement('div');
  item.className = 'hero-mini-stat';
  item.innerHTML = `<strong>${num}</strong><span>${label}</span>`;
  stats.appendChild(item);
});

const journeyCards = document.getElementById('journeyCards');
[['سيتعلم', g.units.map(u => u.name.replace(/^الوحدة\s*\d+\s*:\s*/, '')).join('، '), '💡'], ['سيطبق عبر', g.games.slice(0, 2).map(item => item[1]).join('، '), '⚙️'], ['في النهاية سيتمكن من', g.hero, '🏆']].forEach(([title, text, icon]) => {
  const article = document.createElement('article');
  article.className = 'glass card journey-card';
  article.innerHTML = `<div class="info-icon">${icon}</div><h4>${title}</h4><p>${text}</p>`;
  journeyCards.appendChild(article);
});

const gradeFlowSteps = document.getElementById('gradeFlowSteps');
[['1', 'يفهم المفهوم', g.units[0]?.name || g.hero], ['2', 'يشاهد الشرح المصوّر', 'كل وحدة أصبحت صورة تعليمية مستقلة.'], ['3', 'يجرب النشاط أو اللعبة', g.games[0]?.[1] || 'نشاط تفاعلي'], ['4', 'يحصل على إنجاز واضح', 'يُحفظ التقدم فعليًا داخل المشروع ويظهر في الصفحة الرئيسية.']].forEach(([n, title, text]) => {
  const article = document.createElement('article');
  article.className = 'glass card flow-card';
  article.innerHTML = `<div class="flow-number">${n}</div><h4>${title}</h4><p>${text}</p>`;
  gradeFlowSteps.appendChild(article);
});

function wrapText(text, lineLength = 22) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  words.forEach(word => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > lineLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function buildPosterDataUrl(title, text, accent, badge) {
  const lines = wrapText(text, 24).slice(0, 6);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff7ed" />
        <stop offset="100%" stop-color="#ecfeff" />
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${accent}" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
    </defs>
    <rect width="1200" height="700" rx="40" fill="url(#bg)"/>
    <rect x="30" y="30" width="1140" height="640" rx="36" fill="#ffffff" opacity="0.86"/>
    <rect x="70" y="70" width="170" height="48" rx="24" fill="url(#accent)"/>
    <text x="155" y="102" text-anchor="middle" font-size="24" font-family="Arial" fill="#ffffff">${badge}</text>
    <text x="1090" y="165" text-anchor="end" font-size="52" font-family="Arial" font-weight="700" fill="#0f172a">${title}</text>
    <rect x="70" y="190" width="1060" height="8" rx="4" fill="url(#accent)" opacity="0.8"/>
    ${lines.map((line, i) => `<text x="1090" y="${280 + i * 68}" text-anchor="end" font-size="40" font-family="Arial" fill="#334155">${line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</text>`).join('')}
    <circle cx="120" cy="560" r="54" fill="${accent}" opacity="0.14"/>
    <circle cx="1060" cy="560" r="74" fill="#38bdf8" opacity="0.10"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const unitsSummary = document.getElementById('unitsSummary');
const unitsAccordion = document.getElementById('unitsAccordion');
if (unitsAccordion) unitsAccordion.remove();
g.units.forEach((u, i) => {
  const title = u.name.replace(/^الوحدة\s*\d+\s*:\s*/, '');
  const summary = document.createElement('article');
  summary.className = 'unit-image-card glass card';
  summary.innerHTML = `
    <div class="unit-image-frame">
      <img class="zoomable-image" src="assets/grade-${g.id}-unit-${i + 1}.svg" alt="${title}">
    </div>
    <div class="unit-image-caption">
      <span>الوحدة ${i + 1}</span>
      <h4>${title}</h4>
     
    </div>`;
  unitsSummary.appendChild(summary);
});

const acts = document.getElementById('activitiesList');
g.activities.forEach((a, index) => {
  const li = document.createElement('li');
  li.innerHTML = `<div><strong>${index + 1}. ${a[0]}</strong><span>${a[1]}</span></div><button class="btn secondary small mark-complete" type="button" data-item-type="activity" data-item-key="a-${index}" data-item-title="${a[0]}">أنهيت النشاط</button>`;
  acts.appendChild(li);
});

document.getElementById('teacherNote').textContent = `يمكن للمعلم استخدام أنشطة ${g.short} لتنظيم حصة أو تدريب قصير مع انتقال واضح من المفهوم إلى التطبيق.`;
document.getElementById('parentNote').textContent = `يمكن لولي الأمر متابعة ما تعلمه الطفل في ${g.short} ثم تكرار نشاط منزلي قصير داعم للمفهوم.`;

const gallery = document.getElementById('galleryGrid');
[1, 2, 3].forEach(i => {
  const c = document.createElement('article');
  c.className = 'glass card media-card';
  c.innerHTML = `<img class="zoomable-image" src="assets/grade-${g.id}-gallery-${i}.jpeg" alt="${g.title}">`;
  gallery.appendChild(c);
});

const games = document.getElementById('gamesGrid');
g.games.forEach((x, index) => {
  const c = document.createElement('article');
  c.className = 'glass card interactive-card';
  c.dataset.gameType = x[0];
  c.dataset.gameTitle = x[1];
  c.dataset.itemKey = `g-${index}-${x[0]}`;
  c.innerHTML = `<div class="card-head"><h4>${x[1]}</h4><button class="zoom-btn" type="button" aria-label="تكبير اللعبة">⤢</button></div><p>${x[2]}</p><div class="game-shell"><div class="game-area"></div></div><div class="interactive-actions"><button class="btn primary small mark-complete" type="button" data-item-type="game" data-item-key="g-${index}-${x[0]}" data-item-title="${x[1]}">حفظ الإنجاز</button></div>`;
  games.appendChild(c);
  window.BaraemGames.mount(x[0], c.querySelector('.game-area'));
});

const liveBox = document.createElement('section');
liveBox.className = 'section';
liveBox.innerHTML = `<div class="container"><div class="glass card grade-live-progress"><div><span class="pill">متابعة فعلية</span><h3>تقدم هذا الصف محفوظ</h3><p id="gradeProgressText">جارٍ تحميل التقدم...</p></div><div class="progress-bar large"><span id="gradeProgressBar" style="width:0%"></span></div><div class="grade-next-row"><strong id="gradeNextHint">الخطوة التالية ستظهر هنا.</strong><button class="btn primary" id="printCertificateBtn" type="button">طباعة شهادة الصف</button></div><div class="badge-shelf" id="badgeShelf"></div></div></div>`;
document.querySelector('main').insertBefore(liveBox, document.getElementById('games').closest('section'));

function updateGradeProgress(payload){
  const completions = (payload?.completions || []).filter(item => item.grade_id === id);
  const total = g.activities.length + g.games.length;
  const percent = Math.min(100, Math.round((completions.length / Math.max(1, total)) * 100));
  const bar = document.getElementById('gradeProgressBar');
  const text = document.getElementById('gradeProgressText');
  const nextHint = document.getElementById('gradeNextHint');
  const badgeShelf = document.getElementById('badgeShelf');
  if (bar) bar.style.width = `${percent}%`;
  if (text) text.textContent = `أُنجز ${completions.length} من أصل ${total} عنصرًا في ${g.title} بنسبة ${percent}%.`;

  const completedKeys = new Set(completions.map(item => `${item.item_type}:${item.item_key}`));
  const nextActivity = g.activities.find((activity, index) => !completedKeys.has(`activity:a-${index}`));
  const nextGame = g.games.find((game, index) => !completedKeys.has(`game:g-${index}-${game[0]}`));
  if (nextHint) {
    nextHint.textContent = nextActivity
      ? `الخطوة المقترحة: ${nextActivity[0]}`
      : nextGame
        ? `جرّب اللعبة التالية: ${nextGame[1]}`
        : 'ممتاز، اكتملت عناصر هذا الصف. يمكنك طباعة شهادة الصف الآن.';
  }
  if (badgeShelf) {
    const badges = [
      [completions.length >= 1, 'مستكشف'],
      [percent >= 35, 'متدرّب'],
      [percent >= 70, 'منجز'],
      [percent === 100, 'بطل الصف']
    ];
    badgeShelf.innerHTML = badges.map(([active, label]) => `<span class="badge ${active ? 'earned' : ''}">${label}</span>`).join('');
  }

  document.querySelectorAll('.mark-complete').forEach(btn => {
    const key = `${btn.dataset.itemType}:${btn.dataset.itemKey}`;
    if (completedKeys.has(key)) {
      btn.disabled = true;
      btn.textContent = 'تم الحفظ';
    }
  });
}

async function handleMarkComplete(event){
  const btn = event.target.closest('.mark-complete');
  if (!btn || btn.disabled) return;
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'جارٍ الحفظ...';
  try {
    await window.BaraemProgress.complete(id, btn.dataset.itemType, btn.dataset.itemKey, btn.dataset.itemTitle);
  } catch (error) {
    btn.disabled = false;
    btn.textContent = original;
    alert('تعذر حفظ الإنجاز في قاعدة البيانات.');
  }
}

document.addEventListener('click', handleMarkComplete);
document.addEventListener('click', (event) => {
  if (event.target.closest('#printCertificateBtn')) window.print();
});
window.BaraemProgress.subscribe(updateGradeProgress);
if (window.BaraemProgress.getCache()) updateGradeProgress(window.BaraemProgress.getCache()); else window.BaraemProgress.load();
