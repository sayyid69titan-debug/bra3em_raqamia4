(function(){
  const STUDENT_ID = 'demo-student';
  const LOCAL_KEY = `baraem-progress-${STUDENT_ID}`;
  const subs = new Set();
  let cache = null;
  let muted = localStorage.getItem('baraem-sound-muted') === '1';

  async function request(url, options){
    const res = await fetch(url, options);
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  function readLocal(){
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || { student_id: STUDENT_ID, completions: [] }; }
    catch (error) { return { student_id: STUDENT_ID, completions: [] }; }
  }

  function writeLocal(next){
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    return next;
  }

  function playSuccess(){
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.06;
      gain.connect(ctx.destination);
      [523, 659, 784].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.frequency.value = freq;
        osc.type = 'sine';
        osc.connect(gain);
        const start = ctx.currentTime + index * 0.09;
        osc.start(start);
        osc.stop(start + 0.12);
      });
    } catch (error) {}
  }

  async function load(){
    try {
      cache = await request(`/api/dashboard?studentId=${encodeURIComponent(STUDENT_ID)}`);
      writeLocal(cache);
    } catch (error) {
      cache = readLocal();
      cache.offline = true;
    }
    notify();
    return cache;
  }

  async function complete(gradeId, itemType, itemKey, title){
    try {
      cache = await request('/api/progress/complete', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ studentId: STUDENT_ID, gradeId, itemType, itemKey, title })
      });
      writeLocal(cache);
    } catch (error) {
      const local = readLocal();
      const filtered = local.completions.filter(item => !(item.grade_id === gradeId && item.item_type === itemType && item.item_key === itemKey));
      cache = writeLocal({
        student_id: STUDENT_ID,
        offline: true,
        completions: [{ grade_id: gradeId, item_type: itemType, item_key: itemKey, title, completed_at: new Date().toISOString() }, ...filtered]
      });
    }
    playSuccess();
    notify();
    return cache;
  }

  async function reset(){
    try {
      cache = await request('/api/progress/reset', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ studentId: STUDENT_ID })
      });
    } catch (error) {
      cache = { student_id: STUDENT_ID, offline: true, completions: [] };
    }
    writeLocal(cache);
    notify();
    return cache;
  }

  function subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); }
  function notify(){ subs.forEach(fn=>fn(cache)); }
  function getCache(){ return cache; }
  function setMuted(value){
    muted = Boolean(value);
    localStorage.setItem('baraem-sound-muted', muted ? '1' : '0');
    syncSoundButton();
  }
  function syncSoundButton(){
    const btn = document.getElementById('soundToggle');
    if (!btn) return;
    btn.textContent = muted ? 'الصوت مكتوم' : 'الصوت يعمل';
    btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('soundToggle');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => setMuted(!muted));
    }
    syncSoundButton();
  });

  window.BaraemProgress = { STUDENT_ID, load, complete, reset, subscribe, getCache, setMuted };
})();
