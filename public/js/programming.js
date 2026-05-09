function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function makeBlock(label, tone = '') {
  return `<div class="code-block ${tone}">${label}</div>`;
}

function byId(id) { return typeof id === 'string' ? document.getElementById(id) : id; }

function mountHello(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <div class="stack-preview">
          ${makeBlock('عند الضغط على زر البدء', 'event')}
          ${makeBlock('قل: مرحبًا يا أصدقائي!', 'say')}
          ${makeBlock('تحرك 3 خطوات', 'move')}
        </div>
        <button class="btn primary">تشغيل البرنامج</button>
        <div class="status">اضغط زر التشغيل لترى الشخصية تتكلم ثم تتحرك.</div>
      </div>
      <div class="stage hello-stage">
        <div class="speech">جاهز!</div>
        <div class="sprite">🙂</div>
      </div>
    </div>`;
  const btn = root.querySelector('button');
  const sprite = root.querySelector('.sprite');
  const speech = root.querySelector('.speech');
  btn.onclick = () => {
    speech.textContent = 'مرحبًا يا أصدقائي!';
    sprite.style.transform = 'translateX(-90px)';
    setTimeout(() => { speech.textContent = 'أحب البرمجة!'; }, 900);
    setTimeout(() => { sprite.style.transform = 'translateX(0)'; speech.textContent = 'جاهز!'; }, 2200);
  };
}

function mountMaze(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <p class="mini-note">رتب الأوامر ثم اضغط تشغيل. المطلوب الوصول إلى النجمة.</p>
        <div class="maze-controls"></div>
        <div class="chip-row"><button class="btn primary run-btn">تشغيل</button><button class="btn reset-btn">إعادة</button></div>
        <div class="status">التسلسل الصحيح يساعد الشخصية على الوصول إلى الهدف.</div>
      </div>
      <div class="maze-board" aria-label="لوحة متاهة">
        <div class="maze-sprite">🤖</div>
        <div class="maze-goal">⭐</div>
      </div>
    </div>`;
  const holder = root.querySelector('.maze-controls');
  const sequence = ['يمين', 'أعلى', 'يمين', 'أعلى', 'يمين'];
  sequence.forEach((step, i) => {
    const select = el('select');
    ['اختر خطوة', 'يمين', 'أعلى', 'أسفل', 'يسار'].forEach(v => {
      const option = document.createElement('option');
      option.value = v;
      option.textContent = `${i + 1}. ${v}`;
      select.appendChild(option);
    });
    holder.appendChild(select);
  });
  const sprite = root.querySelector('.maze-sprite');
  const status = root.querySelector('.status');
  function reset() {
    sprite.style.right = '8px';
    sprite.style.bottom = '8px';
    status.textContent = 'التسلسل الصحيح يساعد الشخصية على الوصول إلى الهدف.';
  }
  root.querySelector('.reset-btn').onclick = reset;
  root.querySelector('.run-btn').onclick = async () => {
    reset();
    let x = 0, y = 0;
    const chosen = [...holder.querySelectorAll('select')].map(s => s.value);
    for (const step of chosen) {
      if (step === 'يمين') x += 1;
      if (step === 'يسار') x -= 1;
      if (step === 'أعلى') y += 1;
      if (step === 'أسفل') y -= 1;
      sprite.style.right = `${8 + x * 58}px`;
      sprite.style.bottom = `${8 + y * 58}px`;
      await new Promise(r => setTimeout(r, 420));
    }
    status.textContent = (x === 3 && y === 2)
      ? 'أحسنت! وصلت الشخصية إلى النجمة بالتسلسل الصحيح.'
      : 'اقتربت من الحل. جرّب تعديل الترتيب حتى تصل إلى النجمة.';
  };
}

function mountDraw(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <div class="stack-preview">
          ${makeBlock('عند البدء', 'event')}
          ${makeBlock('كرر 4 مرات', 'loop')}
          ${makeBlock('تحرك 80 خطوة', 'move')}
          ${makeBlock('استدر 90 درجة', 'turn')}
        </div>
        <button class="btn primary draw-btn">ارسم الآن</button>
        <div class="status">لاحظ كيف اختصر التكرار أوامر الرسم.</div>
      </div>
      <div><canvas width="300" height="230"></canvas></div>
    </div>`;
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  function clear() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 5;
  }
  clear();
  root.querySelector('.draw-btn').onclick = async () => {
    clear();
    let x = 70, y = 70, dir = 0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < 4; i++) {
      x += Math.cos(dir * Math.PI / 180) * 80;
      y += Math.sin(dir * Math.PI / 180) * 80;
      ctx.lineTo(x, y);
      ctx.stroke();
      dir += 90;
      await new Promise(r => setTimeout(r, 380));
    }
  };
}

function mountSmart(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <div class="stack-preview">
          ${makeBlock('عند البدء', 'event')}
          ${makeBlock('كرر دائمًا', 'loop')}
          ${makeBlock('تحرك 5 خطوات', 'move')}
          ${makeBlock('إذا لمست الحافة فاستدر', 'if')}
        </div>
        <button class="btn primary smart-btn">تشغيل الكائن الذكي</button>
        <div class="status">راقب ماذا يحدث عندما يصل الكائن إلى الحافة.</div>
      </div>
      <div class="smart-stage"><div class="smart-sprite">🚗</div></div>
    </div>`;
  const sprite = root.querySelector('.smart-sprite');
  const status = root.querySelector('.status');
  let timer;
  root.querySelector('.smart-btn').onclick = () => {
    clearInterval(timer);
    let x = 10;
    let dir = 1;
    sprite.style.left = '10px';
    timer = setInterval(() => {
      x += dir * 5;
      if (x > 230 || x < 10) {
        dir *= -1;
        sprite.style.transform = dir === 1 ? 'scaleX(-1)' : 'scaleX(1)';
        status.textContent = 'لامس الحافة ثم استدار لأنه نفذ الشرط.';
      }
      sprite.style.left = `${x}px`;
    }, 50);
  };
}

function mountStory(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="story-builder">
      <div>
        <p class="mini-note">اختر ترتيب اللبنات ثم شاهد القصة الصغيرة.</p>
        <div class="story-selects">
          <label>اللبنة الأولى<select id="story-a"><option>قل: أهلاً بكم</option><option>انتظر قليلاً</option><option>غيّر الخلفية</option></select></label>
          <label>اللبنة الثانية<select id="story-b"><option>تحرك للأمام</option><option>قل: هيا نبدأ</option><option>غيّر الخلفية</option></select></label>
          <label>اللبنة الثالثة<select id="story-c"><option>قل: تعلمت شيئًا جديدًا</option><option>انتظر قليلاً</option><option>تحرك للأمام</option></select></label>
        </div>
        <div class="chip-row"><button class="btn primary story-btn">تشغيل القصة</button><button class="btn story-reset">إعادة المشهد</button></div>
        <div class="story-code"></div>
      </div>
      <div class="story-stage sky"><div class="story-bubble">ابدأ من هنا</div><div class="story-sprite">🧒</div></div>
    </div>`;
  const stage = root.querySelector('.story-stage');
  const sprite = root.querySelector('.story-sprite');
  const bubble = root.querySelector('.story-bubble');
  const code = root.querySelector('.story-code');
  const reset = () => {
    stage.className = 'story-stage sky';
    sprite.style.transform = 'translateX(0)';
    bubble.textContent = 'ابدأ من هنا';
    code.innerHTML = '';
  };
  root.querySelector('.story-reset').onclick = reset;
  root.querySelector('.story-btn').onclick = async () => {
    reset();
    const values = ['story-a','story-b','story-c'].map(i => root.querySelector('#' + i).value);
    code.innerHTML = values.map(v => makeBlock(v, 'event')).join('');
    for (const step of values) {
      if (step.includes('أهلاً')) bubble.textContent = 'أهلاً بكم';
      if (step.includes('هيا نبدأ')) bubble.textContent = 'هيا نبدأ';
      if (step.includes('تعلمت')) bubble.textContent = 'تعلمت شيئًا جديدًا';
      if (step.includes('تحرك')) sprite.style.transform = 'translateX(-100px)';
      if (step.includes('انتظر')) bubble.textContent = '...';
      if (step.includes('الخلفية')) stage.className = stage.className.includes('sky') ? 'story-stage park' : 'story-stage sky';
      await new Promise(r => setTimeout(r, 800));
    }
  };
}

function mountStars(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <div class="stack-preview">
          ${makeBlock('عند الضغط على الزر', 'event')}
          ${makeBlock('تحرك إلى النجمة التالية', 'move')}
          ${makeBlock('قل: حصلت على نجمة!', 'say')}
        </div>
        <button class="btn primary stars-btn">اجمع النجوم</button>
        <div class="status">كل ضغطة تجعل الشخصية تنتقل إلى نجمة جديدة.</div>
      </div>
      <div class="stage stars-stage"><div class="speech">هيا نبدأ</div><div class="sprite">🐰</div><div class="star s1">⭐</div><div class="star s2">⭐</div><div class="star s3">⭐</div></div>
    </div>`;
  const sprite = root.querySelector('.sprite');
  const speech = root.querySelector('.speech');
  const stars = [...root.querySelectorAll('.star')];
  let step = 0;
  root.querySelector('.stars-btn').onclick = () => {
    if (step >= 3) {
      step = 0;
      sprite.style.transform = 'translateX(0)';
      stars.forEach(s => s.style.opacity = '1');
      speech.textContent = 'أعد اللعب';
      return;
    }
    step += 1;
    sprite.style.transform = `translateX(${-70 * step}px)`;
    stars[step - 1].style.opacity = '.2';
    speech.textContent = 'حصلت على نجمة!';
  };
}

function mountCommands(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <p class="mini-note">اختر أمرًا ثم شغله لترى نتيجته على الكائن.</p>
        <select class="command-select">
          <option>تحرك للأمام</option>
          <option>استدر</option>
          <option>قل: أنا مبرمج صغير</option>
          <option>اقفز</option>
        </select>
        <div class="chip-row"><button class="btn primary command-run">تشغيل الأمر</button></div>
        <div class="status">تعلّم كيف يعطي المبرمج أمرًا واحدًا واضحًا في كل مرة.</div>
      </div>
      <div class="stage command-stage"><div class="speech">بانتظار الأمر</div><div class="sprite">🤖</div></div>
    </div>`;
  const select = root.querySelector('.command-select');
  const sprite = root.querySelector('.sprite');
  const speech = root.querySelector('.speech');
  root.querySelector('.command-run').onclick = () => {
    sprite.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
    const v = select.value;
    if (v.includes('تحرك')) sprite.style.transform = 'translateX(-90px)';
    if (v.includes('استدر')) sprite.style.transform = 'rotate(-35deg)';
    if (v.includes('اقفز')) sprite.style.transform = 'translateY(-35px)';
    speech.textContent = v.includes('قل') ? 'أنا مبرمج صغير' : `تم تنفيذ الأمر: ${v}`;
  };
}

function mountOrderChallenge(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <p class="mini-note">اختر الترتيب الصحيح: بدء ثم تحرك ثم قل نجحت.</p>
        <div class="maze-controls">
          <select><option>اختر اللبنة الأولى</option><option>عند البدء</option><option>قل: نجحت</option><option>تحرك 3 خطوات</option></select>
          <select><option>اختر اللبنة الثانية</option><option>عند البدء</option><option>قل: نجحت</option><option>تحرك 3 خطوات</option></select>
          <select><option>اختر اللبنة الثالثة</option><option>عند البدء</option><option>قل: نجحت</option><option>تحرك 3 خطوات</option></select>
        </div>
        <button class="btn primary order-btn">تحقق من الحل</button>
        <div class="status">رتب اللبنات ثم افحص الحل.</div>
      </div>
      <div class="stack-preview result-stack"></div>
    </div>`;
  const selects = [...root.querySelectorAll('select')];
  const status = root.querySelector('.status');
  const stack = root.querySelector('.result-stack');
  root.querySelector('.order-btn').onclick = () => {
    const vals = selects.map(s => s.value);
    stack.innerHTML = vals.map(v => makeBlock(v, 'event')).join('');
    status.textContent = vals.join('|') === 'عند البدء|تحرك 3 خطوات|قل: نجحت'
      ? 'إجابة صحيحة! رتبت اللبنات بالشكل المناسب.'
      : 'هناك خطأ في الترتيب. جرّب مرة أخرى.';
  };
}

function mountDebugChallenge(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <div class="stack-preview">
          ${makeBlock('عند البدء', 'event')}
          ${makeBlock('كرر 4 مرات', 'loop')}
          ${makeBlock('استدر 90 درجة', 'turn')}
          ${makeBlock('استدر 90 درجة', 'turn')}
        </div>
        <p class="mini-note">أي لبنة يجب استبدالها حتى يرسم البرنامج مربعًا؟</p>
        <select class="debug-select"><option>اختر الإجابة</option><option>اللبنة الثالثة يجب أن تكون تحرك 80 خطوة</option><option>اللبنة الأولى يجب أن تكون قل مرحبًا</option><option>اللبنة الرابعة يجب حذفها فقط</option></select>
        <button class="btn primary debug-btn">تحقق</button>
        <div class="status">فكر في خطوات رسم المربع.</div>
      </div>
      <div class="glass card"><p>التصحيح مهارة مهمة لأن المبرمج لا يتوقف عند الخطأ، بل يلاحظه ثم يصلحه ويجرب من جديد.</p></div>
    </div>`;
  const status = root.querySelector('.status');
  root.querySelector('.debug-btn').onclick = () => {
    status.textContent = root.querySelector('.debug-select').selectedIndex === 1
      ? 'أحسنت! نحتاج إلى لبنة حركة قبل الدوران حتى يظهر الشكل.'
      : 'ليست هذه الإجابة الصحيحة. فكّر في اللبنة الناقصة التي تجعل الرسم يتحرك.';
  };
}

function mountGoalChallenge(id) {
  const root = byId(id); if (!root) return;
  root.innerHTML = `
    <div class="lab-grid">
      <div>
        <p class="mini-note">اختر أربع خطوات فقط لمساعدة الروبوت على الوصول إلى النجمة.</p>
        <div class="maze-controls goal-controls"></div>
        <div class="chip-row"><button class="btn primary goal-run">تشغيل</button><button class="btn goal-reset">إعادة</button></div>
        <div class="status">فكر في الطريق الأقصر.</div>
      </div>
      <div class="maze-board"><div class="maze-sprite">🤖</div><div class="maze-goal" style="right:124px;bottom:124px">⭐</div></div>
    </div>`;
  const holder = root.querySelector('.goal-controls');
  for (let i=0;i<4;i++) {
    const select = el('select');
    ['اختر خطوة', 'يمين', 'أعلى', 'أسفل', 'يسار'].forEach(v => {
      const option = document.createElement('option');
      option.value = v; option.textContent = `${i+1}. ${v}`; select.appendChild(option);
    });
    holder.appendChild(select);
  }
  const sprite = root.querySelector('.maze-sprite');
  const status = root.querySelector('.status');
  function reset(){ sprite.style.right='8px'; sprite.style.bottom='8px'; status.textContent='فكر في الطريق الأقصر.'; }
  root.querySelector('.goal-reset').onclick = reset;
  root.querySelector('.goal-run').onclick = async ()=>{
    reset(); let x=0,y=0;
    const chosen = [...holder.querySelectorAll('select')].map(s=>s.value);
    for (const step of chosen){
      if (step==='يمين') x +=1;
      if (step==='يسار') x -=1;
      if (step==='أعلى') y +=1;
      if (step==='أسفل') y -=1;
      sprite.style.right = `${8 + x*58}px`;
      sprite.style.bottom = `${8 + y*58}px`;
      await new Promise(r=>setTimeout(r,350));
    }
    status.textContent = (x===2 && y===2) ? 'ممتاز! وصلت بأربع خطوات صحيحة.' : 'ما زلت تحتاج إلى تعديل بعض الخطوات.';
  };
}

[
  ['lab-hello', mountHello],
  ['lab-maze', mountMaze],
  ['lab-draw', mountDraw],
  ['lab-smart', mountSmart],
  ['lab-story', mountStory],
  ['lab-stars', mountStars],
  ['lab-commands', mountCommands],
  ['challenge-order', mountOrderChallenge],
  ['challenge-debug', mountDebugChallenge],
  ['challenge-goal', mountGoalChallenge],
].forEach(([id, fn]) => fn(id));


window.ProgrammingLabs = {
  mount(name, root) {
    const map = { hello: mountHello, maze: mountMaze, draw: mountDraw, smart: mountSmart, story: mountStory, stars: mountStars, commands: mountCommands };
    const fn = map[name];
    if (fn) fn(root.id || (root.id = 'lab-' + name + '-modal-' + Math.random().toString(36).slice(2)));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const mounts = [['hello','lab-hello'],['maze','lab-maze'],['draw','lab-draw'],['smart','lab-smart'],['stars','lab-stars'],['commands','lab-commands'],['story','lab-story']];
  mounts.forEach(([name,id]) => {
    const area = document.getElementById(id);
    if (area && area.closest('.program-card')) area.closest('.program-card').dataset.programLab = name;
  });
  if (window.BaraemViewer && window.BaraemViewer.bind) window.BaraemViewer.bind();
});
