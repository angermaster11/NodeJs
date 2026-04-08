# 05 — Parsing Requests

---

## 🗺️ What's in This Section?

```
Incoming HTTP Request
        │
        ▼
┌───────────────────────────────────────┐
│  5.1  Streams    → data flows in      │
│  5.2  Chunks     → pieces of data     │
│  5.3  Buffers    → holding area       │
│  5.4  Reading Chunk  → req.on("data") │
│  5.5  Buffering Chunks → collect all  │
│  5.6  Parsing Request → decode data   │
│  5.7  Using Modules  → clean code     │
└───────────────────────────────────────┘
        │
        ▼
  Usable JSON / Object
```

---

## 5.1 🌊 Streams

> A **Stream** is a continuous flow of data from one place to another — instead of waiting for all data to arrive, you process it **piece by piece as it comes**.

```
                        Stream
┌──────────┐  ─────────────────────►  ┌────────────┐  ─────────────────────►  ┌───────────────┐
│ Browser  │                          │  Node.js   │                          │  Image Server │
│ (Client) │  ◄─────────────────────  │  (Server)  │  ◄─────────────────────  │  / Database   │
└──────────┘         Stream           └────────────┘         Stream           └───────────────┘
```

### Why Streams?

| Without Streams | With Streams |
|---|---|
| Wait for ALL data to load into memory | Process data as it arrives |
| High memory usage for large files | Low memory, efficient |
| User waits longer | Faster response, better UX |

### Types of Streams in Node.js

```
┌─────────────────────────────────────────────────────┐
│                Stream Types                         │
│                                                     │
│  Readable   → Read data   (e.g. req, fs.createReadStream)  │
│  Writable   → Write data  (e.g. res, fs.createWriteStream) │
│  Duplex     → Read + Write (e.g. TCP socket)        │
│  Transform  → Read, modify, Write (e.g. zlib)       │
└─────────────────────────────────────────────────────┘
```

### Duplex Stream (Read + Write)

```
              ┌─────────────────────────────┐
              │       Duplex Stream         │
              │                             │
Application ◄─┤   ┌─────────────────────┐  ├─► Socket
   (Read)     │   │    Read  Buffer      │  │
              │   └─────────────────────┘  │
Application ──┤   ┌─────────────────────┐  ├──► Socket
   (Write)    │   │    Write Buffer      │  │
              │   └─────────────────────┘  │
              └─────────────────────────────┘
```

---

## 5.2 🧩 Chunks

> When data flows through a stream, it is broken into small pieces called **Chunks**. Node.js processes each chunk as soon as it arrives — it doesn't wait for the whole data.

```
┌───────┐   ┌───────┐  ┌───────┐  ┌───────┐              ┌───────┐  ┌───────┐  ┌───────┐   ┌────────┐
│       │   │ Chunk │  │ Chunk │  │ Chunk │              │ Chunk │  │ Chunk │  │ Chunk │   │        │
│ Input │──►│   1   │─►│   2   │─►│   3   │─► Node.js ──►│   1   │─►│   2   │─►│   3   │──►│ Output │
│       │   └───────┘  └───────┘  └───────┘              └───────┘  └───────┘  └───────┘   └────────┘
```

- **Input** gets split into chunks automatically
- Node.js **processes each chunk** without waiting
- Chunks are reassembled into **Output**

### Chunk Reading Timeline

```
Reading side          Processing side
─────────────         ─────────────────
┌─────────┐
│ Chunk 1 │ ──push──► ┌─────────────┐
└─────────┘           │  Chunk 1    │ (processing)
┌─────────┐           └─────────────┘
│ Chunk 2 │ ──push──► ┌─────────────┐
└─────────┘           │  Chunk 2    │ (processing)
┌─────────┐           └─────────────┘
│ Chunk 3 │ ──push──► ┌─────────────┐
└─────────┘           │  Chunk 3    │ (processing)
                      └─────────────┘
```

---

## 5.3 🗄️ Buffers

> A **Buffer** is a temporary **holding area** in memory where chunks of raw binary data are stored while waiting to be processed.

```
                    ┌──────────────────────────────────────┐
                    │             Stream                   │
                    │   ┌──────────────────────────────┐   │
                    │   │      EventEmitter API        │   │
                    │   └──────────────────────────────┘   │
                    │   ┌──────────────────────────────┐   │
       Input ──────►│   │           Buffer             │   │────► Output
                    │   │  [  ][  ][  ][░░][░░][░░]   │   │
                    │   │   filled ──►  │◄── empty     │   │
                    │   └──────────────────────────────┘   │
                    └──────────────────────────────────────┘
```

- **Filled slots** = chunks already received
- **Empty slots** = waiting for more data
- When buffer has enough data → it **flushes** (sends to output)

### Buffer in Node.js

```js
// Buffer stores raw binary data
const buf = Buffer.from("Hello");
console.log(buf);           // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString()); // Hello
```

---

## 5.4 📥 Reading a Chunk

> Use `req.on("data", callback)` to **listen** for each chunk of incoming request data.

```js
} else if (req.method === "POST" && req.url.toLowerCase() === "/submit-details") {

  req.on("data", (chunk) => {
    console.log(chunk);
    // chunk is a Buffer: <Buffer 6e 61 6d 65 3d ...>
  });

  fs.writeFileSync("user-details.txt", "Prashant Jain");
  res.setHeader("Location", "/");
  res.statusCode = 302;
  return res.end();
}
```

### How it works:

```
POST Request arrives
        │
        ▼
req.on("data", (chunk) => { ... })
        │
        ▼
  Each chunk arrives → callback fires
        │
        ▼
  chunk = raw Buffer (binary)
  e.g.  <Buffer 6e 61 6d 65 3d 50 72 61 73 68 61 6e 74>
```

> ⚠️ At this stage you only get **raw binary data** (Buffer), not a readable string yet.

---

## 5.5 📦 Buffering Chunks

> Since data arrives in **multiple chunks**, you need to **collect all chunks** into an array, then join them together when the stream ends.

```js
const body = [];

req.on("data", (chunk) => {
  console.log(chunk);
  body.push(chunk);       // collect each chunk
});

req.on("end", () => {
  // all chunks received → join them → convert to string
  const parsedBody = Buffer.concat(body).toString();
  console.log(parsedBody);
  // Output: name=Prashant&gender=male
});
```

### Visual Flow:

```
chunk 1 arrives → body = [<Buffer ...>]
chunk 2 arrives → body = [<Buffer ...>, <Buffer ...>]
chunk 3 arrives → body = [<Buffer ...>, <Buffer ...>, <Buffer ...>]
                                   │
                               "end" fires
                                   │
                    Buffer.concat(body).toString()
                                   │
                    "name=Prashant&gender=male"
```

| Method | What it does |
|---|---|
| `body.push(chunk)` | Collects each chunk into array |
| `Buffer.concat(body)` | Joins all Buffer chunks into one Buffer |
| `.toString()` | Converts Buffer → readable string |

---

## 5.6 🔍 Parsing the Request

> The raw string `"name=Prashant&gender=male"` is **URL-encoded form data**. Use `URLSearchParams` to parse it into a usable object, then `JSON.stringify` to save it.

```js
req.on("end", () => {
  const parsedBody = Buffer.concat(body).toString();
  console.log(parsedBody);
  // "name=Prashant&gender=male"

  // Step 1: Parse URL-encoded string
  const params = new URLSearchParams(parsedBody);

  // Step 2: Convert to plain object
  const jsonObject = {};
  for (const [key, value] of params.entries()) {
    jsonObject[key] = value;
  }
  console.log(jsonObject);
  // { name: 'Prashant', gender: 'male' }

  // Step 3: Stringify and save
  const jsonString = JSON.stringify(jsonObject);
  console.log(jsonString);
  fs.writeFileSync("user-details.txt", jsonString);
});

res.setHeader("Location", "/");
res.statusCode = 302;
return res.end();
```

### Full Parsing Pipeline:

```
Raw POST body (Buffer)
        │
        ▼  Buffer.concat(body).toString()
"name=Prashant&gender=male"
        │
        ▼  new URLSearchParams(parsedBody)
URLSearchParams object
        │
        ▼  for...of params.entries()
{ name: 'Prashant', gender: 'male' }
        │
        ▼  JSON.stringify(jsonObject)
'{"name":"Prashant","gender":"male"}'
        │
        ▼  fs.writeFileSync(...)
user-details.txt ✅
```

**Result in `user-details.txt`:**
```json
{"name":"Prashant","gender":"male"}
```

---

## 5.7 🗂️ Using Modules

> Split your server logic into **separate files** (modules) to keep code clean, organized, and reusable.

### File Structure:

```
project/
├── app.js        ← entry point (starts server)
├── server.js     ← request handler logic
└── add.js        ← addition utility function
```

### `handler.js` — Request Logic Module

```js
const fs = require("fs");

const requestHandler = (req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    // ... handle home page
  }
  // ... other routes
};

module.exports = requestHandler;  // ← export the function
```

### `app.js` — Entry Point

```js
// Simple Node.js server
const http = require("http");
const requestHandler = require("./handler"); // ← import the module

const server = http.createServer(requestHandler);

server.listen(3000);
```

### How Modules Work:

```
handler.js                         app.js
──────────────────                 ──────────────────────────
const requestHandler = ...         const requestHandler =
                                     require('./handler')
module.exports =                         │
  requestHandler          ──────────────►│
                                   http.createServer(requestHandler)
```

| Concept | Explanation |
|---|---|
| `module.exports` | What gets exported from the file |
| `require('./handler')` | Imports the exported value from another file |
| **Benefit** | Each file has one responsibility → easier to maintain & test |

---

## 🧪 Practice Project — Calculator

> Combining everything from this section into one project.

### How it works:

```
GET  /             → Home page with welcome message
GET  /calculator   → Form with two number inputs
POST /calculate-result → Parse inputs → Add → Show result
```

### Key code from `server.js`:

```js
} else if (req.url === "/calculate-result" && req.method === "POST") {
  let data = [];

  req.on("data", (chunk) => {
    data.push(chunk);                          // 5.4 + 5.5
  });

  req.on("end", () => {
    const parsedData = Buffer.concat(data).toString();  // 5.3
    const params = new URLSearchParams(parsedData);      // 5.6
    const obj = Object.fromEntries(params);

    res.write("<h2>Output: " + addition(Number(obj.num1), Number(obj.num2)) + "</h2>");
    return res.end();
  });
}
```

### `add.js` — Module:

```js
const addition = (a, b) => a + b;
module.exports = addition;
```

---

## 📝 Quick Summary

```
Streams        → Data flows continuously, no need to wait for all of it
Chunks         → Small pieces of data that arrive one by one in a stream
Buffer         → Temporary memory holding area for raw binary chunks
req.on("data") → Fires for each chunk arriving in a POST request
Buffer.concat  → Joins all chunks → .toString() gives readable string
URLSearchParams → Parses "key=value&key2=value2" into an iterable object
module.exports → Exports a value from a file to use in another file
require()      → Imports that exported value
```

---

> 📂 **Previous Section →** [Request Response Cycle](../04_Request_Response_Cycle/)
