"""Make the values for a new Poshword (the password on the gate).

    python3 code/tools/set-poshword.py "new word"

Prints SALT, CHECK and TOKEN_SHA. Paste them over the ones at the top of middleware.js (repo root),
commit and deploy. Everyone will need the new word, and existing unlocks stop working.
The word itself is never saved anywhere, which matters because the repository is public.
The gate ignores capital letters and spaces around the word.
"""
import hashlib
import secrets
import sys

ITER = 20000  # keep in step with ITER in middleware.js

if len(sys.argv) != 2 or not sys.argv[1].strip():
    sys.exit('Usage: python3 code/tools/set-poshword.py "new word"')

word = sys.argv[1].strip().lower()
salt = secrets.token_hex(16)
d = hashlib.pbkdf2_hmac('sha256', word.encode(), bytes.fromhex(salt), ITER, 32)
print(f"const SALT = '{salt}';")
print(f"const CHECK = '{d[:16].hex()}';")
print(f"const TOKEN_SHA = '{hashlib.sha256(d[16:]).hexdigest()}';")
