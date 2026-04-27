(function(){
  const data = window.BARAEM_CONTENT;
  const byId = new Map(data.grades.map(g=>[g.id,g]));

  function flattenTotals(){
    let totalActivities = 0, totalGames = 0;
    data.grades.forEach(g=>{ totalActivities += g.activities.length; totalGames += g.games.length; });
    return { totalActivities, totalGames, totalItems: totalActivities + totalGames };
  }

  function computeDashboard(payload){
    const completions = payload?.completions || [];
    const totals = flattenTotals();
    const doneItems = completions.length;
    const doneActivities = completions.filter(x=>x.item_type==='activity').length;
    const doneGames = completions.filter(x=>x.item_type==='game').length;
    const percent = Math.min(100, Math.round((doneItems / Math.max(1, totals.totalItems)) * 100));
    const byGrade = new Map();
    completions.forEach(item=>{
      const bucket = byGrade.get(item.grade_id) || { total:0, titles:[] };
      bucket.total += 1;
      bucket.titles.push(item.title);
      byGrade.set(item.grade_id, bucket);
    });
    const activeGradeEntry = [...byGrade.entries()].sort((a,b)=>b[1].total-a[1].total)[0];
    const activeGrade = activeGradeEntry ? byId.get(activeGradeEntry[0]) : data.grades[0];
    const latest = completions[0];
    const latestGrade = latest ? byId.get(latest.grade_id) : activeGrade;
    const nextGrade = data.grades.find(g=>!(byGrade.get(g.id)?.total)) || data.grades[Math.min(data.grades.length - 1, (latestGrade?.id || 1))];

    return {
      percent,
      doneItems,
      doneActivities,
      doneGames,
      conceptCount: doneItems,
      latestTitle: latest?.title || 'ابدأ أول نشاط',
      latestGradeTitle: latestGrade?.title || activeGrade.title,
      nextTitle: nextGrade ? `انتقل إلى ${nextGrade.title}` : 'أكمل ألعاب الصف الحالي',
      activeStudents: Math.max(1, Math.min(24, 12 + doneGames + doneActivities)),
      classActivities: doneItems,
      challengePoint: activeGrade?.hero || 'الأنماط والتعليمات',
      homeSuggestion: activeGrade?.activities?.[0]?.[0] || 'نشاط منزلي قصير',
      parentSummary: activeGrade?.units?.[0]?.name?.replace(/^الوحدة\s*\d+\s*:\s*/, '') || 'اكتشاف المفاهيم',
      supportNeed: activeGrade?.games?.[0]?.[1] || 'التسلسل المنطقي'
    };
  }

  function updateHero(summary){
    const percentEls = document.querySelectorAll('[data-progress-percent]');
    const barEls = document.querySelectorAll('[data-progress-bar]');
    const textEls = document.querySelectorAll('[data-progress-text]');
    percentEls.forEach(el=>el.textContent = `${summary.percent}%`);
    barEls.forEach(el=>el.style.width = `${summary.percent}%`);
    textEls.forEach(el=>el.textContent = `أُنجز ${summary.doneItems} عنصرًا بين أنشطة وألعاب مع حفظ فعلي في قاعدة بيانات SQLite.`);
  }

  function fillList(root, rows){
    if(!root) return;
    root.innerHTML = rows.map(([label, value]) => `<li><span>${label}</span><b>${value}</b></li>`).join('');
  }

  function renderDashboards(summary){
    fillList(document.getElementById('studentDashboardList'), [
      ['المفاهيم المكتسبة', `${summary.conceptCount} مفهومًا/مهارة`],
      ['نسبة الإنجاز', `${summary.percent}%`],
      ['آخر نشاط', summary.latestTitle],
      ['التوصية التالية', summary.nextTitle]
    ]);
    fillList(document.getElementById('teacherDashboardList'), [
      ['الطلاب النشطون', `${summary.activeStudents} طالبًا`],
      ['الأنشطة المنجزة', `${summary.classActivities} عنصرًا`],
      ['نقطة التركيز', summary.challengePoint],
      ['اقتراح الحصة التالية', summary.homeSuggestion]
    ]);
    fillList(document.getElementById('parentDashboardList'), [
      ['ما تعلمه الطفل', summary.parentSummary],
      ['يحتاج دعمًا في', summary.supportNeed],
      ['نشاط منزلي مقترح', summary.homeSuggestion],
      ['مستوى التفاعل', summary.percent >= 60 ? 'مرتفع' : summary.percent >= 30 ? 'جيد' : 'في البداية']
    ]);
  }

  function attachReset(){
    const btn = document.getElementById('resetProgressBtn');
    if(btn && !btn.dataset.bound){
      btn.dataset.bound = '1';
      btn.addEventListener('click', async ()=>{
        btn.disabled = true;
        btn.textContent = 'جارٍ إعادة التهيئة...';
        try { await window.BaraemProgress.reset(); }
        finally { btn.disabled = false; btn.textContent = 'إعادة تعيين التقدم'; }
      });
    }
  }

  async function boot(){
    attachReset();
    window.BaraemProgress.subscribe((payload)=>{
      const summary = computeDashboard(payload || { completions: [] });
      updateHero(summary);
      renderDashboards(summary);
      window.dispatchEvent(new CustomEvent('baraem-progress-updated', { detail: payload }));
    });
    await window.BaraemProgress.load();
  }

  window.BaraemDashboard = { computeDashboard };
  document.addEventListener('DOMContentLoaded', boot);
})();
