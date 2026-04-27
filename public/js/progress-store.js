(function(){
  const STUDENT_ID = 'demo-student';
  const STORAGE_KEY = 'baraem-progress-v2';
  const subs = new Set();
  let cache = null;

  function emptyDashboard(){
    return {
      student_id: STUDENT_ID,
      completed: [],
      totalCompleted: 0,
      total_completed: 0,
      byGrade: {},
      by_grade: {},
      lastCompleted: null,
      last_completed: null
    };
  }

  function normalize(data){
    const base = emptyDashboard();
    const merged = Object.assign(base, data || {});
    merged.completed = Array.isArray(merged.completed) ? merged.completed : [];
    merged.totalCompleted = merged.completed.length;
    merged.total_completed = merged.completed.length;
    merged.byGrade = {};
    merged.completed.forEach(item => {
      const grade = item.grade_id || item.gradeId || 'عام';
      merged.byGrade[grade] = (merged.byGrade[grade] || 0) + 1;
    });
    merged.by_grade = merged.byGrade;
    merged.lastCompleted = merged.completed[merged.completed.length - 1] || null;
    merged.last_completed = merged.lastCompleted;
    return merged;
  }

  function readStore(){
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch(e){ return emptyDashboard(); }
  }

  function writeStore(data){
    cache = normalize(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    notify();
    return cache;
  }

  async function load(){
    cache = readStore();
    notify();
    return cache;
  }

  async function complete(gradeId, itemType, itemKey, title){
    const data = readStore();
    const key = `${gradeId}:${itemType}:${itemKey}`;
    const exists = data.completed.some(item => item.key === key);
    if(!exists){
      data.completed.push({
        key,
        student_id: STUDENT_ID,
        grade_id: gradeId,
        gradeId,
        item_type: itemType,
        itemType,
        item_key: itemKey,
        itemKey,
        title: title || 'عنصر منجز',
        completed_at: new Date().toISOString()
      });
    }
    return writeStore(data);
  }

  async function reset(){ return writeStore(emptyDashboard()); }
  function subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); }
  function notify(){ subs.forEach(fn=>fn(cache)); }
  function getCache(){ return cache; }
  window.BaraemProgress = { STUDENT_ID, load, complete, reset, subscribe, getCache };
})();
