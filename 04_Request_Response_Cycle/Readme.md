# 04 — Request & Response Cycle

---

## 🗺️ What's in This Section?

```
Browser sends Request
        │
        ▼
┌──────────────────────────────────────────┐
│  4.1  Node Lifecycle & Event Loop        │
│  4.2  How to Exit Event Loop             │
│  4.3  Understand Request Object          │
│  4.4  Sending Response                   │
│  4.5  Routing Requests                   │
│  4.6  Taking User Input                  │
│  4.7  Redirecting Requests               │
└──────────────────────────────────────────┘
        │
        ▼
Server sends Response back
```

---

## 4.1 🔄 Node Lifecycle & Event Loop

> When you run `node app.js`, Node.js starts and enters its **lifecycle**. The **Event Loop** is the heart of Node.js — it keeps the program alive and handles all incoming events/requests.

### Node.js Server Architecture:

```
                         ┌──────────────────────────────────────────────────┐
                         │               NODE.JS SERVER                     │
                         │                                                  │
                         │  ┌──────────────┐        ┌───────────────────┐  │
REQUESTS ───────────────►│  │  EVENT QUEUE │        │   THREAD POOL     │  │──► 🗄️ Database
                         │  │              │        │                   │  │
                         │  │  [ req 1  ]  │        │  [ worker 1 ]     │  │──► 📁 File System
                         │  │  [ req 2  ]  │        │  [ worker 2 ]     │  │
                         │  │  [ req 3  ]  │        │  [ worker 3 ]     │  │──► 🌐 Network
                         │  └──────┬───────┘        │  [ worker 4 ]     │  │
                         │         │                └───────────────────┘  │──► 🔧 Others
                         │         ▼                         ▲              │
                         │     EVENT LOOP ──────────────────►│              │
                         │         │                                        │
                         │         ▼                                        │
                         │   OPERATION COMPLETED                            │
                         └──────────────────────────────────────────────────┘
```

### How the Lifecycle Works:

```
node app.js
    │
    ▼
1. Parse & execute code (register callbacks, create server)
    │
    ▼
2. Event Loop starts  ←─────────────────────────────┐
    │                                                │
    ▼                                                │
3. Check Event Queue for pending events             │
    │                                                │
    ▼                                                │
4. Execute callback (handle request)                │
    │                                                │
    ▼                                                │
5. Offload heavy tasks to Thread Pool               │
    │                                                │
    ▼                                                │
6. When done → "Operation Completed" → loop back ───┘
```

| Component | Role |
|---|---|
| **Event Queue** | Holds all incoming requests/events in order |
| **Event Loop** | Picks events from queue and handles them (single-threaded) |
| **Thread Pool** | Handles heavy operations (DB, File, Network) in background |
| **Callbacks** | Functions that run when an operation completes |

> 💡 The Event Loop is **single-threaded** but Node.js is fast because heavy work is offloaded to the **Thread Pool** (libuv).

---

## 4.2 🛑 How to Exit the Event Loop

> By default, the Event Loop keeps running (waiting for requests). Use `process.exit()` to **force stop** the loop.

```js
// Simple Node.js server
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req);
  process.exit(); // ← Stops the event loop immediately
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### Exit methods:

| Method | Description |
|---|---|
| `process.exit()` | Immediately stops the event loop & exits Node |
| `process.exit(0)` | Exit with code `0` — success |
| `process.exit(1)` | Exit with code `1` — failure/error |
| `Ctrl + C` | Manually stop the running server in terminal |

> ⚠️ You almost **never** use `process.exit()` in a real server — servers are meant to keep running. It's useful for scripts or debugging.

---

## 4.3 🔎 Understanding the Request Object

> Every time a client makes a request, Node.js passes a **`req`** (IncomingMessage) object to your callback. It contains all the info about the request.

```js
const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
});
```

### Key Properties of `req`:

| Property | Example Value | Description |
|---|---|---|
| `req.url` | `"/products"` | The path requested |
| `req.method` | `"GET"` / `"POST"` | HTTP method used |
| `req.headers` | `{ host, accept, cookie... }` | All request headers |
| `req.headers.host` | `"localhost:3000"` | Hostname + port |
| `req.headers['user-agent']` | `"Mozilla/5.0..."` | Browser info |
| `req.headers.cookie` | `"token=abc123..."` | Cookies sent |

### Sample `req.headers` output:

```
{
  host: 'localhost:3000',
  connection: 'keep-alive',
  'cache-control': 'max-age=0',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
  accept: 'text/html,application/xhtml+xml...',
  'sec-fetch-site': 'none',
  'sec-fetch-mode': 'navigate',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-US,en;q=0.9',
  cookie: 'token=eyJhbGc...'
}
```

> 📖 Full list of HTTP headers: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

### Test it:
```
Visit http://localhost:3000/         → req.url = "/"
Visit http://localhost:3000/products → req.url = "/products"
```

---

## 4.4 📤 Sending a Response

> Use the **`res`** (ServerResponse) object to send data back to the client.

```js
const server = http.createServer((req, res) => {
  // 1. Set the Content-Type header
  res.setHeader('Content-Type', 'text/html');

  // 2. Write the response body
  res.write('<html>');
  res.write('<head><title>Complete Coding</title></head>');
  res.write('<body><h1>Like / Share / Subscribe</h1></body>');
  res.write('</html>');

  // 3. End the response (must always call this!)
  res.end();
});
```

### Key `res` Methods & Properties:

| Method / Property | Description |
|---|---|
| `res.setHeader(key, value)` | Set a response header (e.g., Content-Type) |
| `res.write(data)` | Write a chunk of the response body |
| `res.end()` | Signal response is complete — **always required** |
| `res.statusCode = 200` | Set the HTTP status code (default: 200) |

### Common Content-Type values:

```
'text/html'         → HTML page
'application/json'  → JSON data
'text/plain'        → Plain text
'text/css'          → CSS file
```

### What you see in browser DevTools (Network tab):

```
Response Headers:
  Content-Type: text/html

Response Body:
  <html>
    <head><title>Complete Coding</title></head>
    <body><h1>Like / Share / Subscribe</h1></body>
  </html>
```

---

## 4.5 🛣️ Routing Requests

> **Routing** means sending different responses based on the **URL** the client requested. Check `req.url` to decide what to respond with.

```js
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Complete Coding</title></head>');

  if (req.url === '/') {
    res.write('<h1>Welcome to Home page</h1>');
    return res.end();  // ← return stops execution here
  } else if (req.url.toLowerCase() === '/products') {
    res.write('<h1>Products</h1>');
    return res.end();  // ← return stops execution here
  }

  res.write('<body><h1>Like / Share / Subscribe</h1></body>');
  res.write('</html>');
  return res.end();
});
```

### Route Flow:

```
Request: GET /
    │
    ├─ req.url === "/"         → "Welcome to Home page" + end ✅
    │
Request: GET /products
    │
    ├─ req.url === "/products" → "Products" + end ✅
    │
Request: GET /anything-else
    │
    └─ falls through           → default response + end ✅
```

### ⚠️ Common Error — `ERR_HTTP_HEADERS_SENT`

```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

**Cause:** You called `res.write()` or `res.setHeader()` **after** `res.end()` was already called.

**Fix:** Always use `return res.end()` to stop code execution after ending the response:

```js
// ❌ Wrong — res.end() doesn't stop execution
if (req.url === '/') {
  res.write('<h1>Home</h1>');
  res.end();
}
res.write('more data'); // ← ERROR! Response already ended

// ✅ Correct — return stops execution
if (req.url === '/') {
  res.write('<h1>Home</h1>');
  return res.end(); // ← return exits the function
}
```

---

## 4.6 📝 Taking User Input (HTML Forms)

> Serve an **HTML form** in your response so users can submit data. The form POSTs data to a server route.

```js
if (req.url === '/') {
  res.write('<h1>Welcome to Home page</h1>');
  res.write('<form action="/submit-details" method="POST">');
  res.write('<input type="text" id="name" name="name" placeholder="Enter your name"><br><br>');
  res.write('<label for="gender">Gender:</label>');
  res.write('<input type="radio" id="male"   name="gender" value="male">');
  res.write('<label for="male">Male</label>');
  res.write('<input type="radio" id="female" name="gender" value="female">');
  res.write('<label for="female">Female</label><br><br>');
  res.write('<button type="submit">Submit</button>');
  res.write('</form>');
  return res.end();
}
```

### How Form Submission Works:

```
User fills form → clicks Submit
        │
        ▼
Browser sends POST request to /submit-details
  with body: name=Prashant&gender=male
        │
        ▼
Node.js receives req.method === "POST"
         and   req.url    === "/submit-details"
        │
        ▼
Server handles the data
```

---

## 4.7 🔀 Redirecting Requests

> After processing a form (POST), redirect the user to another page using **status code `302`** and the `Location` header. This is the **POST → Redirect → GET** pattern.

```js
} else if (req.method === 'POST' &&
           req.url.toLowerCase() === '/submit-details') {

  fs.writeFileSync('user-details.txt', 'Prashant Jain'); // save data

  res.statusCode = 302;               // 302 = Found (redirect)
  res.setHeader('Location', '/');     // redirect to home
  return res.end();
}
```

### Redirect Flow (POST → Redirect → GET):

```
1. User submits form
        │  POST /submit-details
        ▼
2. Server processes data
   (writes to file, saves to DB, etc.)
        │
        ▼
3. Server responds with 302 + Location: /
        │
        ▼
4. Browser automatically follows the redirect
        │  GET /
        ▼
5. Home page is shown ✅
```

### HTTP Status Codes Reference:

| Code | Meaning | When to use |
|---|---|---|
| `200` | OK | Successful GET response |
| `301` | Moved Permanently | URL changed forever |
| `302` | Found (Redirect) | Temporary redirect (after POST) |
| `404` | Not Found | Route doesn't exist |
| `500` | Internal Server Error | Something crashed on server |

### `user-details.txt` result:
```
Prashant Jain
```

---

## 🧪 Practice Project — Myntra Navigation

> Combining routing into a mini Myntra clone with a navbar.

```js
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.write("<h1>Welcome to Myntra</h1>");
  res.write("<nav><a href='/home'>Home</a> | <a href='/men'>Men</a> | <a href='/women'>Women</a> | <a href='/kids'>Kids</a> | <a href='/cart'>Cart</a></nav>");

  if      (req.url === "/home")   { res.write("<h2>Welcome to Home Section</h2>"); }
  else if (req.url === "/men")    { res.write("<h2>Welcome to Men Section</h2>"); }
  else if (req.url === "/women")  { res.write("<h2>Welcome to Women Section</h2>"); }
  else if (req.url === "/kids")   { res.write("<h2>Welcome to Kids Section</h2>"); }
  else if (req.url === "/cart")   { res.write("<h2>Welcome to Cart Section</h2>"); }
  else                            { res.write("<h2>Page Not Found</h2>"); }

  res.end();
});
```

### Route Map:

```
GET /home   → Welcome to Home Section
GET /men    → Welcome to Men Section
GET /women  → Welcome to Women Section
GET /kids   → Welcome to Kids Section
GET /cart   → Welcome to Cart Section
GET /???    → Page Not Found
```

---

## 📝 Quick Summary

```
Event Loop     → Keeps Node.js alive, processes one event at a time
Thread Pool    → Handles heavy I/O (DB, files, network) in background
process.exit() → Stops the event loop (use only in scripts/debugging)
req.url        → Which route was requested  (e.g. "/products")
req.method     → HTTP method used           (e.g. "GET", "POST")
req.headers    → All HTTP headers sent by the client
res.setHeader  → Set response header        (e.g. Content-Type)
res.write()    → Write response body chunk
res.end()      → Finalize and send response (always use return res.end())
res.statusCode → HTTP status code           (200, 302, 404...)
302 Redirect   → POST → save data → redirect → GET (prevents re-submit)
```

---

> 📂 **Next Section →** [Parsing Requests](../05_Requet_Paring/)
