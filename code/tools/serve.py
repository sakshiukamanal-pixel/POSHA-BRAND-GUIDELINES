"""Local preview server for Mac / Linux (the .ps1 tools are Windows-only).

    python3 code/tools/serve.py          # http://localhost:8080
    python3 code/tools/serve.py 8090     # another port

Serves the portal from the repo root and tells the browser never to cache,
so every refresh shows your latest edits. Refuses to serve .env.
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_head(self):
        if os.path.basename(self.path.split('?')[0]).startswith('.env'):
            self.send_error(404)
            return None
        return super().send_head()


if __name__ == '__main__':
    print(f'Posha Brand Guidelines → http://localhost:{PORT}  (Ctrl-C to stop)')
    http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
