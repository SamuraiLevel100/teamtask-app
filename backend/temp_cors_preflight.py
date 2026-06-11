import http.client
conn = http.client.HTTPConnection('127.0.0.1', 8000)
headers = {
    'Origin': 'http://localhost:5173',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'authorization,content-type'
}
conn.request('OPTIONS', '/board-members/15', headers=headers)
res = conn.getresponse()
print('status', res.status)
print(res.getheaders())
print(res.read().decode())
conn.close()
