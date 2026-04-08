# 02 — Installing Node.js & Setting Up the Environment

---

## 💻 What is an IDE?

> **IDE** = **Integrated Development Environment**

An IDE is a **software suite** that bundles all the tools a developer needs into **one place** — instead of using separate apps for editing, debugging, and testing.

```
Without IDE                        With IDE
──────────────                     ──────────────────────────────────
Text Editor  ┐                     ┌──────────────────────────────┐
Debugger     ├── Separate tools    │         VS Code (IDE)        │
Terminal     │                     │  ✔ Code Editor               │
Git Client   ┘                     │  ✔ Debugger                  │
                                   │  ✔ Terminal                  │
                                   │  ✔ Git Integration           │
                                   │  ✔ Extensions                │
                                   └──────────────────────────────┘
```

### 🔑 Why Do We Need an IDE?

| Benefit | Description |
|---|---|
| **Streamlines Development** | Everything in one place — no switching between tools |
| **Increases Productivity** | Auto-complete, snippets, shortcuts speed up coding |
| **Simplifies Complex Tasks** | Debugging, refactoring, and testing made easy |
| **Unified Workspace** | Code, run, debug, version control — all together |

### 🛠️ Key IDE Features

```
┌────────────────────────────────────────────────────┐
│                  IDE Features                      │
│                                                    │
│  1. ✏️  Code Autocomplete  (IntelliSense)           │
│  2. 🎨  Syntax Highlighting                        │
│  3. 🔀  Version Control    (Git integration)       │
│  4. 🐛  Error Checking     (Linting / Problems)    │
└────────────────────────────────────────────────────┘
```

---

## ⚙️ VS Code — Recommended Extensions & Settings

> **VS Code** is the most popular IDE for Node.js development. Lightweight, fast, and highly extensible.

### 📦 Must-Have Extensions

| Extension | Purpose |
|---|---|
| **Prettier** | Auto-formats your code on save |
| **ESLint** | Catches JS errors and bad patterns |
| **Node.js Extension Pack** | Snippets + IntelliSense for Node |
| **GitLens** | Enhanced Git integration |

### ⚙️ Recommended Settings

```json
// settings.json
{
  "editor.formatOnSave": true,        // Prettier formats on every save
  "editor.wordWrap": "on",            // Line wrap — no horizontal scroll
  "editor.tabSize": 2,                // Tab size: 4 → 2 (JS standard)
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**How to open settings.json:**
`Ctrl + Shift + P` → type `Open User Settings (JSON)` → Enter

---

## 🖥️ Installation Guide

### 🪟 Windows Setup

```
Step 1: Install VS Code
  → https://code.visualstudio.com/
  → Download Windows Installer (.exe)
  → Run installer, follow setup wizard

Step 2: Install Node.js (LTS version)
  → https://nodejs.org/
  → Download "LTS" version (recommended)
  → Run the .msi installer

Step 3: Verify Installation
  → Open Command Prompt / PowerShell
  → node -v     (should show version e.g. v22.x.x)
  → npm -v      (should show npm version)
```

### 🍎 macOS Setup

```
Step 1: Install VS Code
  → https://code.visualstudio.com/
  → Download macOS .dmg
  → Drag VS Code to Applications folder

Step 2: Install Node.js
  Option A — Direct:
    → https://nodejs.org/ → Download LTS .pkg → Install

  Option B — via Homebrew (recommended):
    → /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    → brew install node

Step 3: Verify
  → Open Terminal
  → node -v
  → npm -v
```

### 🐧 Linux Setup

```
Step 1: Install VS Code
  → https://code.visualstudio.com/
  → Download .deb (Debian/Ubuntu) or .rpm (Fedora)
  → Install via terminal:
      sudo dpkg -i code_*.deb      # Ubuntu/Debian
      sudo rpm -i code_*.rpm       # Fedora

Step 2: Install Node.js (via NodeSource)
  → curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  → sudo apt-get install -y nodejs

  OR using nvm (recommended):
  → curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  → nvm install --lts
  → nvm use --lts

Step 3: Verify
  → node -v
  → npm -v
```

---

## 🚀 Executing Your First `.js` File

```
Project Folder
└── app.js
```

**app.js**
```js
console.log("Hello from Node.js!");
```

**Run it:**
```bash
node app.js
# Output: Hello from Node.js!
```

### 📌 Key Concepts When Running Files

| Concept | Details |
|---|---|
| **Node Command** | `node filename.js` — executes JS in Node.js environment |
| **`require()` Syntax** | `require('module')` — loads built-in, external, or local modules |
| **Modular Code** | `require` separates concerns, making code reusable and clean |
| **Caching** | Modules are **cached** — even if required multiple times, executed only once |

```js
// Using require
const fs = require('fs');              // built-in module
const express = require('express');    // third-party (npm)
const myModule = require('./myFile');  // local file
```

```
First require('./myFile')  →  File is read & executed  →  Result cached
Second require('./myFile') →  Returns cached result    →  No re-execution
```

---

## 🔁 What is REPL?

> **REPL** = **Read → Evaluate → Print → Loop**

An **interactive shell** built into Node.js that lets you run JavaScript code **line by line** — great for quick testing and experimentation.

```
You type code
     │
     ▼
┌────────────────────────────────┐
│           Node.js REPL         │
│                                │
│  READ    →  reads your input   │
│  EVAL    →  executes it        │
│  PRINT   →  shows the result   │
│  LOOP    →  waits for more     │
└────────────────────────────────┘
```

### ▶️ Starting the REPL

```bash
node
# You'll see the > prompt — you're inside REPL now!
```

### 💡 REPL Features

| Feature | Command / Description |
|---|---|
| **Interactive Shell** | Run JS code instantly, line by line |
| **Quick Testing** | Test snippets, APIs, and logic on the fly |
| **Built-in Help** | Type `.help` to see all REPL commands |
| **Save Session** | `.save filename.js` — saves your session to a file |
| **Load Session** | `.load filename.js` — loads and runs a saved file |
| **Exit** | `.exit` or `Ctrl + C` twice |
| **Node.js API Access** | Direct access to all Node.js built-in modules |
| **Customizable** | Prompt and behaviour can be customized programmatically |

### 🧪 REPL in Action

```
$ node
Welcome to Node.js v22.0.0
> 2 + 2
4
> "Hello " + "Node"
'Hello Node'
> const arr = [1, 2, 3]
undefined
> arr.map(x => x * 2)
[ 2, 4, 6 ]
> .help
.break    Sometimes you get stuck, this gets you out
.clear    Alias for .break
.editor   Enter editor mode
.exit     Exit the REPL
.help     Print this help message
.load     Load JS from a file into the REPL session
.save     Save all evaluated commands in this REPL session to a file
> .exit
$
```

---

## 📝 Quick Summary

```
IDE         → All-in-one coding environment (VS Code recommended)
Extensions  → Prettier (format), ESLint (errors), tab size = 2
Install     → nodejs.org (LTS) + code.visualstudio.com
Run file    → node filename.js
require()   → loads modules, results are cached
REPL        → Interactive Node.js shell → node → type JS → instant result
```

---

> 📂 **Next Section →** [Creating First Server](../03_Creating_First_Server/)
