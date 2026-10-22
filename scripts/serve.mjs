import http from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('public');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.otf':'font/otf', '.mp4':'video/mp4', '.vtt':'text/vtt', '.txt':'text/plain' };
http.createServer(async (req,res) => {
 try {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
  const info=await stat(file); const range=req.headers.range;
  res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges','bytes');
  if(range){const match=/bytes=(\d+)-(\d*)/.exec(range);if(!match){res.writeHead(416).end();return;}
   const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),info.size-1):info.size-1;
   if(start>=info.size||end<start){res.writeHead(416).end();return;}
   const {createReadStream}=await import('node:fs');res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});createReadStream(file,{start,end}).pipe(res);
  }else{res.setHeader('Content-Length',info.size);res.end(await readFile(file));}
 } catch {res.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
