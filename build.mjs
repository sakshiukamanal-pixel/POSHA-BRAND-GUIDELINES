// Vercel build: assembles the static site into ./public.
// Uses the local code/ + database/ files when they're present (e.g. `vercel --prod` from this folder);
// otherwise pulls the copy published to R2 by code/tools/publish-site.ps1, checking every file
// against site-manifest.json. Media and fonts are not copied: vercel.json proxies /assets/* to R2.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';

// Local files present → local manifest. Otherwise use the newest manifest on R2, so a plain
// "Redeploy" in the Vercel dashboard always picks up the latest publish-site.ps1 run.
let manifest = JSON.parse(await readFile('site-manifest.json', 'utf8'));
if (!existsSync('code/js/app.js')) {
  const res = await fetch(`${manifest.base}/_site/site-manifest.json?t=${Date.now()}`);
  if (res.ok) manifest = await res.json();
  else console.warn(`Using bundled manifest (R2 manifest: HTTP ${res.status})`);
}
const out = 'public';
await mkdir(out, { recursive: true });
await copyFile('index.html', `${out}/index.html`);

let local = 0, pulled = 0;
for (const f of manifest.files) {
  let buf;
  if (existsSync(f.path)) {
    buf = await readFile(f.path);
    local++;
  } else {
    const url = `${manifest.base}/_site/${f.path.split('/').map(encodeURIComponent).join('/')}?v=${f.sha1}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${f.path}: HTTP ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
    const sha1 = createHash('sha1').update(buf).digest('hex');
    if (sha1 !== f.sha1) throw new Error(`${f.path}: checksum mismatch, run publish-site.ps1 again`);
    pulled++;
  }
  await mkdir(dirname(`${out}/${f.path}`), { recursive: true });
  await writeFile(`${out}/${f.path}`, buf);
}
console.log(`Built ${manifest.files.length} files into ${out}/ (${local} local, ${pulled} from R2)`);
