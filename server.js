const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const pdfDir = path.join(publicDir, 'pdfs');
const dataDir = path.join(__dirname, 'data');
const runtimeDataDir = process.env.VERCEL ? os.tmpdir() : dataDir;
const progressFile = path.join(runtimeDataDir, 'baraem-progress.json');

app.use(express.json());
app.use(express.static(publicDir));

function readProgressStore() {
  fs.mkdirSync(runtimeDataDir, { recursive: true });
  if (!fs.existsSync(progressFile)) {
    fs.writeFileSync(progressFile, JSON.stringify({ completions: [] }, null, 2), 'utf8');
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    return { completions: Array.isArray(parsed.completions) ? parsed.completions : [] };
  } catch (error) {
    return { completions: [] };
  }
}

function writeProgressStore(store) {
  fs.mkdirSync(runtimeDataDir, { recursive: true });
  fs.writeFileSync(progressFile, JSON.stringify(store, null, 2), 'utf8');
}

function getStudentCompletions(studentId) {
  return readProgressStore().completions
    .filter(item => item.student_id === studentId)
    .sort((a, b) => String(b.completed_at).localeCompare(String(a.completed_at)));
}

function runDb(command, payload = {}) {
  const studentId = payload.student_id || 'demo-student';
  const store = readProgressStore();

  if (command === 'dashboard') {
    return { student_id: studentId, completions: getStudentCompletions(studentId) };
  }

  if (command === 'complete') {
    const gradeId = Number(payload.grade_id);
    const completion = {
      student_id: studentId,
      grade_id: gradeId,
      item_type: payload.item_type,
      item_key: payload.item_key,
      title: payload.title || 'عنصر منجز',
      completed_at: new Date().toISOString()
    };
    store.completions = store.completions.filter(item => !(
      item.student_id === studentId &&
      item.grade_id === gradeId &&
      item.item_type === completion.item_type &&
      item.item_key === completion.item_key
    ));
    store.completions.unshift(completion);
    writeProgressStore(store);
    return { student_id: studentId, completions: getStudentCompletions(studentId) };
  }

  if (command === 'reset') {
    store.completions = store.completions.filter(item => item.student_id !== studentId);
    writeProgressStore(store);
    return { student_id: studentId, completions: [] };
  }

  throw new Error('أمر قاعدة البيانات غير معروف');
}

app.get('/api/pdfs', (req, res) => {
  fs.mkdirSync(pdfDir, { recursive: true });
  fs.readdir(pdfDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'تعذر قراءة ملفات PDF' });
    const pdfs = files
      .filter(name => name.toLowerCase().endsWith('.pdf'))
      .sort((a, b) => a.localeCompare(b, 'ar'))
      .map(name => ({ name, url: `/pdfs/${encodeURIComponent(name)}` }));
    res.json(pdfs);
  });
});

app.get('/api/dashboard', (req, res) => {
  try {
    const student_id = req.query.studentId || 'demo-student';
    res.json(runDb('dashboard', { student_id }));
  } catch (error) {
    res.status(500).json({ error: 'تعذر تحميل لوحة المتابعة', details: String(error.message || error) });
  }
});

app.post('/api/progress/complete', (req, res) => {
  try {
    const payload = {
      student_id: req.body.studentId || 'demo-student',
      grade_id: req.body.gradeId,
      item_type: req.body.itemType,
      item_key: req.body.itemKey,
      title: req.body.title || 'عنصر منجز'
    };
    if (!payload.grade_id || !payload.item_type || !payload.item_key) {
      return res.status(400).json({ error: 'البيانات المطلوبة غير مكتملة' });
    }
    res.json(runDb('complete', payload));
  } catch (error) {
    res.status(500).json({ error: 'تعذر حفظ التقدم', details: String(error.message || error) });
  }
});

app.post('/api/progress/reset', (req, res) => {
  try {
    const student_id = req.body.studentId || 'demo-student';
    res.json(runDb('reset', { student_id }));
  } catch (error) {
    res.status(500).json({ error: 'تعذر تصفير التقدم', details: String(error.message || error) });
  }
});

if (require.main === module) {
  app.listen(port, () => console.log(`براعم رقمية تعمل على http://localhost:${port}`));
}

module.exports = app;
