"""Local preview server for Mac / Linux (the .ps1 tools are Windows-only).

    python3 code/tools/serve.py          # http://localhost:8080
    python3 code/tools/serve.py 8090     # another port

Serves the portal from the repo root and tells the browser never to cache,
so every refresh shows your latest edits. Refuses to serve .env.
"""
import hashlib
import http.server
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    # Lets the Poshword gate (code/gate/) be tried locally: checks the word the same way middleware.js does.
    # The local preview itself is never locked.
    def do_POST(self):
        if self.path != '/__unlock':
            self.send_error(404)
            return
        try:
            word = str(json.loads(self.rfile.read(int(self.headers.get('Content-Length') or 0)) or b'{}').get('word', '')).strip().lower()
        except ValueError:
            word = ''
        with open(os.path.join(ROOT, 'middleware.js')) as f:
            src = f.read()
        val = lambda name: re.search(r"const %s = '?([0-9a-f]+)'?;" % name, src).group(1)
        d = hashlib.pbkdf2_hmac('sha256', word.encode(), bytes.fromhex(val('SALT')), int(val('ITER')), 32)
        ok = d[:16].hex() == val('CHECK')
        body = json.dumps({'ok': ok}).encode()
        self.send_response(200 if ok else 401)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_head(self):
        if os.path.basename(self.path.split('?')[0]).startswith('.env'):
            self.send_error(404)
            return None
        return super().send_head()


if __name__ == '__main__':
    print(f'Posha Brand Guidelines → http://localhost:{PORT}  (Ctrl-C to stop)')
    http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
