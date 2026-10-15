// Vercel build: assembles the static site into ./public.
// - Git deploys (GitHub push) and `vercel --prod`: the repo has code/ + database/, so every file in
//   them is copied as is (code/tools is skipped — it's local tooling, not part of the site).
// - Older non-git deploys without those folders: pulls the copy published to R2 by
//   code/tools/publish-site.ps1, checking each file against the manifest.
// Media and fonts are not copied: vercel.json proxies /assets/* to Cloudflare R2.
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';

const out = 'public';
await mkdir(out, { recursive: true });
await copyFile('index.html', `${out}/index.html`);

if (existsSync('code/js/app.js')) {
  let n = 0;
  async function copyDir(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name).replace(/\\/g, '/');
      if (e.name.startsWith('.') || p === 'code/tools') continue;
      if (e.isDirectory()) { await copyDir(p); continue; }
      await mkdir(dirname(`${out}/${p}`), { recursive: true });
      await copyFile(p, `${out}/${p}`);
      n++;
    }
  }
  await copyDir('code');
  await copyDir('database');
  console.log(`Built ${n} files into ${out}/ from the repository`);
} else {
  let manifest = JSON.parse(await readFile('site-manifest.json', 'utf8'));
  const res = await fetch(`${manifest.base}/_site/site-manifest.json?t=${Date.now()}`);
  if (res.ok) manifest = await res.json();
  else console.warn(`Using bundled manifest (R2 manifest: HTTP ${res.status})`);
  for (const f of manifest.files) {
    const url = `${manifest.base}/_site/${f.path.split('/').map(encodeURIComponent).join('/')}?v=${f.sha1}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${f.path}: HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (createHash('sha1').update(buf).digest('hex') !== f.sha1) throw new Error(`${f.path}: checksum mismatch, run publish-site.ps1 again`);
    await mkdir(dirname(`${out}/${f.path}`), { recursive: true });
    await writeFile(`${out}/${f.path}`, buf);
  }
  console.log(`Built ${manifest.files.length} files into ${out}/ from R2`);
}
