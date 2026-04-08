# 03 — First Node Server

---

## 🗺️ What's in This Section?

```
┌──────────────────────────────────────────┐
│  3.1  How DNS Works?                     │
│  3.2  How Web Works?                     │
│  3.3  What are Protocols?                │
│  3.4  Node Core Modules                  │
│  3.5  Require Keyword                    │
│  3.6  Creating First Node Server         │
└──────────────────────────────────────────┘
```

---

## 3.1 🌐 How DNS Works?

> **DNS** = **Domain Name System** — the internet's phonebook. It translates human-friendly domain names (like `google.com`) into machine-readable IP addresses (like `87.245.200.153`).

### Simple DNS Lookup:

```
You type: www.google.com
        │
        ▼
┌───────────────┐    "Where is google.com?"    ┌─────────────┐
│    Browser    │ ──────────────────────────► │  DNS Server │
│  (Your PC)    │ ◄────────────────────────── │             │
└───────────────┘   "google.com = 87.245.200.153" └─────────────┘
        │
        ▼
Browser connects to 87.245.200.153
        │
        ▼
┌───────────────────┐
│  Google's Server  │  ──► Sends back the website
└───────────────────┘
```

### 4 Steps of DNS Resolution:

| Step | What Happens |
|---|---|
| **1. Domain Name Entry** | User types `www.example.com` in the browser |
| **2. DNS Query** | Browser sends a query to a DNS server to resolve the domain |
| **3. DNS Server Responds** | DNS server provides the correct IP address |
| **4. Browser Connects** | Browser uses the IP to connect to the web server & loads the site |

### How DNS Actually Works (Deep Dive):

```
Browser types: example.com
        │
        ▼  (1) Check local cache first
┌──────────────────┐
│   DNS Resolver   │  (your ISP or 8.8.8.8)
└────────┬─────────┘
         │  (2) Not cached? Ask Root DNS
         ▼
┌──────────────────┐
│   Root DNS       │  "I don't know, but ask TLD server for .com"
└────────┬─────────┘
         │  (3) Ask TLD DNS
         ▼
┌──────────────────┐
│   TLD DNS        │  (.com server — run by Verisign)
│   (.com, .net)   │  "Ask the Authoritative server"
└────────┬─────────┘
         │  (4) Ask Authoritative DNS
         ▼
┌──────────────────┐
│  Authoritative   │  (e.g. Cloudflare, Google DNS)
│  DNS Server      │  "example.com = 93.184.216.34" ✅
└──────────────────┘
         │
         ▼  (5) IP returned to browser → connect!
```

| DNS Server | Role |
|---|---|
| **Root DNS** | Starting point — directs to correct TLD server (`.com`, `.org`) |
| **TLD DNS** | Handles top-level domains — directs to authoritative server |
| **Authoritative DNS** | Has the actual IP — answers the query (e.g. Cloudflare, Google DNS) |

---

## 3.2 🕸️ How Web Works?

> When you type a URL and hit Enter, a whole chain of events happens behind the scenes before you see a webpage.

```
You type: https://www.example.com
        │
        ▼
Step 1: Client Request Initiation
  Browser initiates a network call

        │
        ▼
Step 2: DNS Resolution
  Browser contacts DNS server → gets IP address of the domain

        │
        ▼
Step 3: TCP Connection
  Browser establishes a TCP connection with the server's IP

        │
        ▼
Step 4: HTTP Request
  Browser sends an HTTP request to the server
  GET / HTTP/1.1
  Host: www.example.com

        │
        ▼
Step 5: Server Processing
  Server receives request, processes it, prepares a response

        │
        ▼
Step 6: HTTP Response
  Server sends HTTP response back
  HTTP/1.1 200 OK
  Content-Type: text/html
  <html>...</html>

        │
        ▼
Step 7: Network Transmission
  Response travels back to the client over the network

        │
        ▼
Step 8: Client Receives Response
  Browser receives and interprets the response

        │
        ▼
Step 9: Rendering
  Browser renders the HTML/CSS/JS → You see the webpage ✅
```

### Visual Summary:

```
┌──────────┐  Enter URL   ┌───────────┐  Translates   ┌──────────────┐
│  User    │ ──────────►  │  Browser  │ ────domain──►  │  DNS Server  │
└──────────┘              └─────┬─────┘   to IP        └──────┬───────┘
                                │                             │
                         gets IP◄────────────────────────────┘
                                │
                    TCP connect + HTTP Request
                                │
                                ▼
                         ┌─────────────┐
                         │   Server    │  stores/generates website
                         └──────┬──────┘
                                │ HTTP Response
                                ▼
                         ┌─────────────┐
                         │   Browser   │  renders → you see the page ✅
                         └─────────────┘
```

---

## 3.3 🔒 What are Protocols?

> A **Protocol** is a set of **rules** that define how data is transmitted between devices over a network. Think of it as a common language both the browser and server agree to speak.

### HTTP vs HTTPS:

```
HTTP (No Encryption)                  HTTPS (Encrypted)
──────────────────────────            ──────────────────────────
User ──► password: xyz123             User ──► password: xyz123
              │                                     │
              ▼ plain text                          ▼ SSL/TLS encryption
         Hacker sees: xyz123               Hacker sees: #d8g3!k9z (gibberish)
              │                                     │
              ▼                                     ▼
         ❌ Not secure                        ✅ Secure
```

### Protocol Comparison:

| Protocol | Full Name | What it Does | Used For |
|---|---|---|---|
| **HTTP** | HyperText Transfer Protocol | Browser ↔ Server communication, sends data in **plain text** | Basic browsing (no sensitive data) |
| **HTTPS** | HTTP Secure | Same as HTTP but **encrypted** using SSL/TLS | Banking, e-commerce, login pages |
| **TCP** | Transmission Control Protocol | Ensures **reliable, ordered, error-checked** delivery of data | Foundation for HTTP/HTTPS |

### How SSL/TLS Works (HTTPS):

```
Browser                          Server
   │                                │
   │──── "Hello, let's connect" ───►│
   │◄─── "Here's my certificate" ───│  (SSL certificate)
   │──── "OK, I trust you" ─────────►│
   │                                │
   └──────── Encrypted tunnel ───────┘
             (all data encrypted)
```

> 💡 **HTTP** is like sending a postcard (anyone can read it). **HTTPS** is like sending a locked box (only the recipient can open it).

---

## 3.4 📦 Node Core Modules

> **Core Modules** are built-in modules that come bundled with Node.js — no `npm install` needed. Just `require()` them and use them.

```
Node.js
   │
   ├── fs        → File System
   ├── http      → HTTP Server
   ├── https     → HTTPS / SSL Server
   ├── path      → File Paths
   ├── os        → Operating System info
   ├── events    → Event-driven programming
   ├── crypto    → Hashing & Encryption
   ├── url       → URL parsing
   └── ... more
```

### Why Core Modules?

| Feature | Description |
|---|---|
| **Built-in** | Included with every Node.js installation |
| **No Installation** | No need for `npm install` — directly available |
| **Performance** | Highly optimized, written in C++ under the hood |

### Most Used Core Modules:

| Module | What it Does | Example Use |
|---|---|---|
| `fs` | Read & write files | `fs.readFileSync('file.txt')` |
| `http` | Create HTTP servers & make requests | `http.createServer(...)` |
| `https` | Launch an SSL (secure) server | `https.createServer(options, ...)` |
| `path` | Handle & transform file paths | `path.join(__dirname, 'file.txt')` |
| `os` | Get OS-related info (CPU, memory, platform) | `os.platform()`, `os.freemem()` |
| `events` | Create & handle custom events | `new EventEmitter()` |
| `crypto` | Hashing, encryption, random bytes | `crypto.createHash('sha256')` |
| `url` | Parse and format URL strings | `new URL('https://example.com')` |

```js
// Example: Using core modules
const fs     = require('fs');     // file system
const http   = require('http');   // http server
const path   = require('path');   // file paths
const os     = require('os');     // OS info

console.log(os.platform());       // 'linux' / 'darwin' / 'win32'
console.log(path.join(__dirname, 'app.js'));
```

---

## 3.5 🔑 Require Keyword

> `require()` is the way to **import modules** in Node.js (CommonJS module system).

```js
const moduleName = require('module');
```

### 3 Types of Modules You Can Require:

```js
// 1. Built-in (Core) module — no path, no install needed
const http = require('http');

// 2. Third-party module — installed via npm
const express = require('express');

// 3. Local/Custom module — your own file (use ./ path)
const myModule = require('./myModule');
```

```
require('./myModule')
        │
        ▼
┌──────────────────────────────────────────────┐
│  Node.js searches in this order:             │
│                                              │
│  1. Core modules   (http, fs, path...)       │
│  2. node_modules/  (npm packages)            │
│  3. File path      (./myFile or ../myFile)   │
└──────────────────────────────────────────────┘
```

### Key Facts about `require()`:

| Feature | Details |
|---|---|
| **Purpose** | Imports a module into the current file |
| **Caching** | Module is **cached** after first `require()` — executed only once even if required multiple times |
| **`.js` optional** | `require('./myModule')` works — no need to add `.js` extension |
| **Path Resolution** | Searches: core modules → `node_modules` → file paths |
| **Returns** | Whatever `module.exports` was set to in that file |

```
First  require('./utils')  →  File is read & executed  →  Result cached
Second require('./utils')  →  Returns from cache        →  No re-execution ✅
```

---

## 3.6 🚀 Creating Your First Node Server

> Use the built-in `http` module to create a server. The server listens for incoming requests and fires a callback for every request.

### Step-by-step (3 ways to write it):

**Method 1 — Named function:**
```js
// Simple Node.js server
const http = require('http');

function requestListener(req, res) {
  console.log(req);
}

http.createServer(requestListener);
```

**Method 2 — Anonymous function:**
```js
const http = require('http');

http.createServer(function (req, res) {
  console.log(req);
});
```

**Method 3 — Arrow function (modern, most common):**
```js
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req);
});

server.listen(3000);
```

**Method 4 — Full server with PORT variable + callback:**
```js
// Simple NodeJS server
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### Run the server:
```bash
node app.js
# Server running at http://localhost:3000/
```

### How it works:

```
node app.js
     │
     ▼
http.createServer(callback) ← registers the request handler
     │
     ▼
server.listen(3000) ← opens port 3000, event loop starts
     │
     ▼  (waiting for requests...)
     │
     │  Browser visits http://localhost:3000/
     ▼
callback fires → (req, res) => { ... }
     │
     ▼
req = IncomingMessage object (all request data)
res = ServerResponse object (used to send response)
```

### What `console.log(req)` shows:

```
IncomingMessage {
  _readableState: ...,
  _events: [Object: null prototype],
  _eventsCount: 2,
  method: 'GET',
  url: '/',
  headers: {
    host: 'localhost:3000',
    connection: 'keep-alive',
    ...
  },
  ...
}
```

### Key Concepts:

| Concept | Description |
|---|---|
| `http.createServer(cb)` | Creates a new HTTP server, `cb` runs on every request |
| `server.listen(PORT)` | Starts listening on the given port — keeps event loop alive |
| `req` | IncomingMessage — contains all info about the incoming request |
| `res` | ServerResponse — used to write and send a response back |
| **Port 3000** | Convention for local development (can be any unused port) |

---

## 📝 Quick Summary

```
DNS         → Translates domain names → IP addresses
              Browser → DNS Resolver → Root → TLD → Authoritative → IP ✅

Web Flow    → URL entered → DNS lookup → TCP connect → HTTP req → Server
              → HTTP res → Browser renders → You see page ✅

HTTP        → Plain text communication (not secure)
HTTPS       → Encrypted with SSL/TLS (secure) ← always prefer this
TCP         → Ensures reliable, ordered data delivery

Core Modules → Built-in, no install: fs, http, https, path, os, events, crypto
require()    → Imports modules | cached after first call | .js optional

First Server →
  const http   = require('http');
  const server = http.createServer((req, res) => { ... });
  server.listen(3000, () => console.log('Server running'));
```

---

> 📂 **Next Section →** [Request & Response Cycle](../04_Request_Response_Cycle/)
