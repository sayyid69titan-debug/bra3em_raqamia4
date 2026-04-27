const fs = require('fs');
const required = ['public/index.html','public/css/styles.css','public/js/main.js'];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}
console.log('Static Vercel build is ready.');
