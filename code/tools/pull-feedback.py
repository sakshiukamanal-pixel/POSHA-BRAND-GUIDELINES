"""Copy every feedback entry from the Google Sheet into the project, so nothing is lost if the sheet goes away.

    python3 code/tools/pull-feedback.py

Writes feedback/feedback.csv (opens in Excel / Numbers / Sheets) and feedback/feedback.json.
Entries already saved here are kept even if they're later deleted from the sheet.
The feedback/ folder is ignored by git: the repository is public and these rows hold names and emails.

Needs FEEDBACK_EXPORT_KEY in .env, matching EXPORT_KEY in the Apps Script's Script properties.
The sheet's web app URL is read from database/site.js → feedback.endpoint.
"""
import csv
import json
import os
import re
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'feedback')


def env(name):
    try:
        with open(os.path.join(ROOT, '.env')) as f:
            for line in f:
                k, _, v = line.strip().partition('=')
                if k == name:
                    return v.strip()
    except FileNotFoundError:
        pass
    return os.environ.get(name, '')


def endpoint():
    with open(os.path.join(ROOT, 'database', 'site.js')) as f:
        m = re.search(r"feedback:\s*\{[^}]*?endpoint:\s*'([^']*)'", f.read(), re.S)
    return m.group(1) if m else ''


def main():
    url, key = endpoint(), env('FEEDBACK_EXPORT_KEY')
    if not url:
        sys.exit('No feedback.endpoint in database/site.js')
    if not key:
        sys.exit('No FEEDBACK_EXPORT_KEY in .env')

    # POST so the key stays out of the URL; Google answers with a redirect that urllib follows as a GET
    body = urllib.parse.urlencode({'action': 'export', 'key': key}).encode()
    with urllib.request.urlopen(urllib.request.Request(url, data=body), timeout=60) as r:
        data = json.loads(r.read().decode('utf-8'))
    if not data.get('ok'):
        sys.exit(f"The sheet refused the export: {data.get('error', 'unknown error')}. "
                 'Check EXPORT_KEY in the Apps Script project settings matches FEEDBACK_EXPORT_KEY in .env.')

    headers = [str(h) for h in data['headers']]
    remote = [dict(zip(headers, row)) for row in data['rows']]

    os.makedirs(OUT, exist_ok=True)
    json_path = os.path.join(OUT, 'feedback.json')
    saved = []
    if os.path.exists(json_path):
        with open(json_path) as f:
            saved = json.load(f)

    # Merge: one entry per (time, email, text); keep local ones the sheet no longer has
    ident = lambda r: (str(r.get('Received', '')), str(r.get('Email', '')), str(r.get('Feedback', '')))
    merged, seen = [], set()
    for r in saved + remote:
        k = ident(r)
        if k not in seen:
            seen.add(k)
            merged.append(r)
    merged.sort(key=lambda r: str(r.get('Received', '')))
    added = len(merged) - len(saved)

    with open(json_path, 'w') as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)
    cols = headers + [c for r in merged for c in r if c not in headers]
    cols = list(dict.fromkeys(cols))
    with open(os.path.join(OUT, 'feedback.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(merged)

    print(f'{len(merged)} entries saved to feedback/ ({added} new).')


if __name__ == '__main__':
    main()
