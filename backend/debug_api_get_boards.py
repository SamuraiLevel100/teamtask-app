import json
import urllib.request
from jose import jwt

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

token = jwt.encode({"sub": "Bob"}, SECRET_KEY, algorithm=ALGORITHM)
print('token', token)
req = urllib.request.Request(
    'http://127.0.0.1:8000/boards/',
    headers={'Authorization': f'Bearer {token}'}
)
with urllib.request.urlopen(req) as resp:
    data = resp.read().decode('utf-8')
    print(data)
