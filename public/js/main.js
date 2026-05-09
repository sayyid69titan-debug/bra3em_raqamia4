const data = window.BARAEM_CONTENT;

const valueCards = document.getElementById('valueCards');
const flowSteps = document.getElementById('flowSteps');
const differenceCards = document.getElementById('differenceCards');
const gradeTracksGrid = document.getElementById('gradeTracksGrid');
const sidePdf = document.getElementById('pdfLibraryToggleSide');
const topPdf = document.getElementById('pdfLibraryToggle');
if (sidePdf && topPdf) sidePdf.addEventListener('click', () => topPdf.click());
const quickGradeSelect = document.getElementById('quickGradeSelect');
const quickStartBtn = document.getElementById('quickStartBtn');
const printReportBtn = document.getElementById('printReportBtn');
const printDashboardBtn = document.getElementById('printDashboardBtn');

const valueItems = [
  ['للطفل', 'يتعلم المفهوم بصريًا ثم يطبقه عبر نشاط أو لعبة بدل الاكتفاء بالشرح النظري.', '🧒'],
  ['للمعلم', 'يحصل على أنشطة عربية جاهزة ومسار صفّي واضح يمكن عرضه وتنفيذه بسهولة.', '👩‍🏫'],
  ['لولي الأمر', 'يرى ملخصًا أبسط لما تعلمه الطفل وأين يحتاج دعمًا وما النشاط المقترح التالي.', '👨‍👩‍👧']
];

const stepItems = [
  ['1', 'يختار الطفل الصف', 'انتقال مباشر إلى المرحلة المناسبة دون تشتيت.'],
  ['2', 'يتعرف على المفهوم بصريًا', 'بطاقات وصور ونصوص مختصرة بدل الفقرات الثقيلة.'],
  ['3', 'يطبق عبر نشاط أو لعبة', 'كل مفهوم يرتبط بتجربة عملية واضحة وممتعة.'],
  ['4', 'تظهر نتيجة أو تقدم', 'لوحات متابعة ونسب إنجاز واقتراح للخطوة التالية.']
];

const differenceItems = [
  ['منهج عربي منظم', 'تدرج صفي واضح من التأسيس حتى الابتكار بدل محتوى مبعثر.', '🌱'],
  ['تجربة ملموسة', 'الطفل لا يقرأ فقط؛ بل يتفاعل ويلعب ويشاهد نتيجة مباشرة.', '🚀'],
  ['قابل للتوسع', 'الهيكل الحالي يدعم إضافة تتبع تقدم وتقارير وأدوار متعددة لاحقًا.', '📈']
];

function renderInfoCards(target, items) {
  if (!target) return;
  items.forEach(([title, text, icon]) => {
    const article = document.createElement('article');
    article.className = 'glass card info-card';
    article.innerHTML = `
      <div class="info-icon">${icon}</div>
      <h4>${title}</h4>
      <p>${text}</p>`;
    target.appendChild(article);
  });
}

function renderFlow(target, items) {
  if (!target) return;
  items.forEach(([number, title, text]) => {
    const article = document.createElement('article');
    article.className = 'glass card flow-card';
    article.innerHTML = `
      <div class="flow-number">${number}</div>
      <h4>${title}</h4>
      <p>${text}</p>`;
    target.appendChild(article);
  });
}

function getAchievementText(grade) {
  if (grade.id <= 2) return `${grade.activities.length} أنشطة تأسيسية و${grade.games.length} ألعاب مبكرة`;
  if (grade.id <= 4) return `${grade.activities.length} نشاطًا في المنطق والخوارزميات`;
  return `${grade.activities.length} نشاطًا ومشروعات ابتكارية`;
}

function renderGradeTracks() {
  if (!gradeTracksGrid) return;
  const groups = [
    {
      title: 'الصف الأول والثاني: التأسيس الرقمي',
      sideLeft: 'التحليل',
      sideRight: 'التعرف على الأنماط',
      grades: data.grades.filter(g => g.id <= 2)
    },
    {
      title: 'الصف الثالث والرابع: المنطق والخوارزميات',
      sideLeft: 'التجريد',
      sideRight: 'الخوارزميات',
      grades: data.grades.filter(g => g.id >= 3 && g.id <= 4)
    },
    {
      title: 'الصف الخامس والسادس: النمذجة والابتكار',
      sideLeft: 'المتغيرات',
      sideRight: 'المشروعات',
      grades: data.grades.filter(g => g.id >= 5)
    }
  ];

  groups.forEach(group => {
    const section = document.createElement('section');
    section.className = 'track-group';
    const cards = group.grades.map(grade => {
      const learn = grade.units[0]?.name.replace('الوحدة 1: ', '') || grade.hero;
      const practice = grade.games[0]?.[1] || 'نشاط تفاعلي';
      const achieve = getAchievementText(grade);
      return `
        <article class="track-grade-block glass">
          <div class="track-grade-head">
            <img class="track-thumb" src="assets/grade-${grade.id}-hero.png" alt="${grade.title}">
            <div>
              <span class="track-grade-label">${grade.title}</span>
              <h4>${grade.short}</h4>
            </div>
          </div>
          <div class="track-cards">
            <div class="track-card learn"><span>سيتعلم</span><strong>${learn}</strong></div>
            <div class="track-card practice"><span>سيطبق</span><strong>${practice}</strong></div>
            <div class="track-card achieve"><span>سيحقق</span><strong>${achieve}</strong></div>
          </div>
          <div class="chip-row">
            <span class="chip">${grade.games.length} ألعاب</span>
            <span class="chip">${grade.activities.length} نشاطًا</span>
            <a class="btn secondary small" href="${grade.slug}">ادخل الصف</a>
          </div>
        </article>`;
    }).join('');

    section.innerHTML = `
      <div class="track-group-head">
        <div class="track-side-note">${group.sideLeft}</div>
        <div>
          <h3>${group.title}</h3>
          <p>واجهة مختصرة وواضحة تعتمد بطاقات التعلم والتطبيق والإنجاز بدل الفقرات الطويلة.</p>
        </div>
        <div class="track-side-note alt">${group.sideRight}</div>
      </div>
      <div class="track-group-grid">${cards}</div>`;
    gradeTracksGrid.appendChild(section);
  });

  const programming = document.createElement('article');
  programming.className = 'glass card bonus-programming';
  programming.innerHTML = `
    <div>
      <span class="pill">قسم إضافي</span>
      <h3>البرمجة باللبنات والتحديات</h3>
      <p>مسار داعم يربط التفكير الحاسوبي بتطبيقات برمجية بسيطة وتحديات عملية قابلة للعرض.</p>
    </div>
    <a class="btn primary" href="programming.html">ادخل قسم البرمجة</a>`;
  gradeTracksGrid.appendChild(programming);
}

function bootQuickStart() {
  if (!quickGradeSelect || !quickStartBtn) return;
  quickGradeSelect.innerHTML = data.grades
    .map(grade => `<option value="${grade.slug}">${grade.title}</option>`)
    .join('');
  quickStartBtn.addEventListener('click', () => {
    window.location.href = quickGradeSelect.value || 'grade-1.html';
  });
}

function updateMission(summary) {
  const missionTitle = document.getElementById('missionTitle');
  const missionText = document.getElementById('missionText');
  const missionLink = document.getElementById('missionLink');
  if (!missionTitle || !missionText || !missionLink) return;

  const nextGrade = data.grades.find(grade => {
    const completed = (summary.rawCompletions || []).filter(item => item.grade_id === grade.id).length;
    return completed < grade.activities.length + grade.games.length;
  }) || data.grades[0];
  const nextActivity = nextGrade.activities[0]?.[0] || nextGrade.games[0]?.[1] || 'نشاط تفاعلي';
  missionTitle.textContent = `مهمة اليوم: ${nextActivity}`;
  missionText.textContent = `ابدأ من ${nextGrade.title} وأنجز نشاطًا واحدًا فقط. بعد الحفظ سيظهر التقدم مباشرة في لوحة المتابعة.`;
  missionLink.href = nextGrade.slug;
}

function bindPrintActions() {
  [printReportBtn, printDashboardBtn].forEach(btn => {
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => window.print());
  });
}

renderInfoCards(valueCards, valueItems);
renderFlow(flowSteps, stepItems);
renderInfoCards(differenceCards, differenceItems);
renderGradeTracks();
bootQuickStart();
bindPrintActions();

window.BaraemHome = { updateMission };
