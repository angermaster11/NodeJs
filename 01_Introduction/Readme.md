# 01 — Introduction to Node.js

---

## 🟢 What is Node.js?

> **Node.js** is an open-source, cross-platform **JavaScript runtime environment** that lets you run JavaScript **outside of a browser** — on a server or any computer.

```
Browser               Node.js
┌─────────────┐       ┌──────────────────────────┐
│  JavaScript │  ──►  │  JavaScript on Server /  │
│  in Browser │       │  Terminal / Computer     │
└─────────────┘       └──────────────────────────┘
```

### 🔑 Key Points

| Concept | Description |
|---|---|
| **JavaScript Runtime** | Executes JS code outside the browser |
| **V8 Engine** | Runs on Chrome's V8 engine (written in C++) — compiles JS directly to native machine code for blazing performance |
| **Formula** | `V8 + Backend Features = Node.js` |
| **Design** | Event-driven, non-blocking I/O model |
| **Full-Stack JS** | Use JavaScript on both server and client sides |
| **Scalability** | Ideal for scalable network applications |
| **Versatility** | Web servers, real-time chat, REST APIs |

---

## 🏗️ Node.js Architecture (How it Works)

```
┌─────────────────────────────────────────────────────┐
│                   Your JS Code                      │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              Node.js Runtime                        │
│  ┌──────────────┐   ┌──────────────────────────┐   │
│  │  V8 Engine   │   │  Node.js APIs             │   │
│  │  (Executes   │   │  (fs, http, path, etc.)   │   │
│  │   JS → C++)  │   └──────────────────────────┘   │
│  └──────────────┘                                   │
│  ┌────────────────────────────────────────────────┐ │
│  │         libuv (Event Loop + Thread Pool)       │ │
│  │  Non-blocking I/O  │  File System  │  Network  │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Node.js Features

### 1. Non-Blocking I/O
- Performs operations **without waiting** for one to finish before starting the next.
- Perfect for I/O-heavy tasks (reading files, DB calls, network requests).

```
Traditional (Blocking)        Node.js (Non-Blocking)
──────────────────────        ──────────────────────
Task 1 → wait...              Task 1 ──► continue
Task 2 → wait...              Task 2 ──► continue
Task 3 → wait...              Task 3 ──► continue
                              All results come back via callbacks/promises
```

### 2. Networking Support
- Supports **TCP/UDP sockets** — handles low-level network operations that browsers can't.

### 3. File System Access
- Can **read and write files** directly using the `fs` module — not possible in browsers (security restriction).

### 4. Server-Side Capabilities
- Handles **HTTP requests**, file operations, and all server-side logic.

### 5. Modules
- Organize code into reusable pieces using `require()` (CommonJS) or `import` (ES Modules).

```js
// Example
const fs = require('fs');       // built-in module
const express = require('express'); // third-party module
```

---

## ❌ What Node.js Does NOT Have (Browser Features Removed)

> Node.js runs on the **server**, so browser-specific stuff doesn't exist here.

| Feature | Available in Browser | Available in Node.js |
|---|---|---|
| `window` object | ✅ | ❌ |
| DOM Manipulation | ✅ | ❌ |
| BOM (`navigator`, `screen`) | ✅ | ❌ |
| `localStorage` / `sessionStorage` | ✅ | ❌ |
| Browser `fetch` | ✅ | ❌ (use `node-fetch` or built-in `fetch` in v18+) |

---

## 🌐 JavaScript on the Client vs Server

### 🖥️ Client-Side JavaScript (Browser)

```
User opens browser
       │
       ▼
┌─────────────────────────────┐
│        Browser              │
│  ┌─────────────────────┐    │
│  │  HTML + CSS + JS    │    │  ◄── Displays web page
│  │  DOM Manipulation   │    │  ◄── Handles user clicks
│  │  Loads Files        │    │  ◄── Fetches assets from server
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Client-side JS responsibilities:**
- 🎨 Turn HTML into what you see on screen
- 🖱️ Handle user interactions (clicks, forms)
- 🔄 Update page content dynamically
- 📥 Load files/assets from the server

---

### 🖧 Server-Side JavaScript (Node.js)

```
Client Request
       │
       ▼
┌─────────────────────────────────────────┐
│            Node.js Server               │
│                                         │
│  ✔ Database Management (CRUD)           │
│  ✔ Authentication & Authorization       │
│  ✔ Input Validation                     │
│  ✔ Session Management                   │
│  ✔ API Management                       │
│  ✔ Error Handling                       │
│  ✔ Security (XSS, SQL Injection, etc.)  │
│  ✔ Data Encryption                      │
│  ✔ Logging & Monitoring                 │
└─────────────────────────────────────────┘
       │
       ▼
   Response sent back to client
```

---

## 🔒 Client Code vs Server Code

```
┌──────────────────────┐         ┌──────────────────────┐
│    CLIENT (Browser)  │         │    SERVER (Node.js)  │
│                      │  HTTP   │                      │
│  - HTML, CSS, JS     │ ──────► │  - Business Logic    │
│  - Visible to user   │  req    │  - DB Operations     │
│  - Limited access    │ ◄────── │  - Hidden from user  │
│  - Security risks    │  res    │  - Secure operations │
└──────────────────────┘         └──────────────────────┘
```

| Aspect | Client-Side | Server-Side |
|---|---|---|
| **Access** | User can see/modify | Hidden & protected |
| **Environment** | Browser APIs | File system, DB, etc. |
| **Security** | Exposed — handle with care | Secure operations live here |
| **Performance** | Limited by user's device | Powerful server hardware |
| **Data Handling** | Limited | Direct DB access |
| **Async** | Browser events | Non-blocking I/O optimized |
| **Scalability** | Per user | Handles multiple clients |

---

## 🚀 What Can You Build with Node.js?

```
┌─────────────────────────────────────────────────────────────┐
│                    Node.js Use Cases                        │
│                                                             │
│  🌐 Web Servers          🔴 Real-Time Apps (WebSockets)     │
│  🖥️  Desktop Apps (Electron)  📡 IoT Device Servers         │
│  🤖 Automation Scripts   🏗️  Build Tools                    │
│  🛠️  Local Utility Scripts                                  │
└─────────────────────────────────────────────────────────────┘
```

| Use Case | Example |
|---|---|
| **Real-Time Apps** | Chat apps, live notifications via WebSockets |
| **REST API Servers** | Backend for mobile/web apps |
| **Desktop Apps** | Cross-platform apps using **Electron** |
| **IoT** | Server-side apps for smart devices |
| **Local Scripts** | Automate tasks like a JS version of shell scripts |
| **Build Tools** | Webpack, Grunt, Gulp, Browserify, Brunch, Yeoman |

---

## 🛠️ Popular Build Tools Powered by Node.js

```
┌─────────────┐  ┌───────────┐  ┌──────────┐  ┌─────────────┐
│   Webpack   │  │   Grunt   │  │   Gulp   │  │ Browserify  │
│  (Bundler)  │  │ (Task Run)│  │(Task Run)│  │  (Bundler)  │
└─────────────┘  └───────────┘  └──────────┘  └─────────────┘
┌─────────────┐  ┌───────────┐
│   Brunch    │  │   Yeoman  │
│  (Bundler)  │  │(Scaffolding)│
└─────────────┘  └───────────┘
```

---

## 📝 Quick Summary

```
Node.js = V8 Engine + Backend APIs + Event Loop

✅ Run JS on server
✅ Non-blocking, fast, scalable
✅ Full-stack JavaScript possible
❌ No DOM, no window, no browser APIs
```

---

> 📂 **Next Section →** [Installing Node.js](../02_Installing_NodeJs/)
