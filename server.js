const http = require('http');
const fs = require('fs');
const path = require('path');
const publicDir = path.join(__dirname, 'public');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.pdf':'application/pdf'};
function safePath(urlPath){
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const rel = clean === '/' ? '/index.html' : clean;
  const full = path.normalize(path.join(publicDir, rel));
  return full.startsWith(publicDir) ? full : path.join(publicDir, 'index.html');
}
http.createServer((req,res)=>{
  let file = safePath(req.url);
  if (!fs.existsSync(file) && !path.extname(file)) file += '.html';
  if (!fs.existsSync(file)) file = path.join(publicDir, 'index.html');
  res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 3000, ()=> console.log('Local preview: http://localhost:'+(process.env.PORT||3000)));
