# Alexandria | Professional Central Database Library Management System

A production-ready, multi-device **Library Management System** with a centralized live database, real-time cross-device synchronization, and full Admin & Member role authentication.

---

## 🗄️ Real Database Concept & Multi-Device Access

All books, members, usernames, passwords, loan records, and cover art are persisted in the **Central Database** (`data/library_database.json`).

### 📱 How to Access from Any Device (Phone, Tablet, Laptop)

The backend server is built with **pure Node.js** (Zero external `npm install` dependencies required!):

#### Step 1: Start the Database Server on your Computer
Open PowerShell or Command Prompt in this folder:
```powershell
cd C:\Users\USER\.gemini\antigravity\scratch\library-system
node server.js
```

You will see:
```text
======================================================
🏛️  ALEXANDRIA LIVE DATABASE SERVER ONLINE!
======================================================
💻 On this computer:          http://localhost:3000
📱 Any Phone/Tablet/Device:   http://192.168.1.X:3000
🗄️  Persistent Database:      data/library_database.json
======================================================
```

#### Step 2: Open on your Phone or Any Other Device
- Connect your phone or other device to the same Wi-Fi network.
- Open your phone's browser (Safari, Chrome) and type the address shown in the console (e.g. `http://192.168.1.X:3000`).
- **Done!** You can now log in, borrow books, or manage members from your phone!

#### Step 3: Real-Time Live Synchronization
- If you add or borrow a book from your **phone**, it **instantly appears on your PC** without reloading (automatic 3-second live sync polling).
- If a member self-registers on their **tablet**, the Administrator sees their username and password immediately on the **desktop PC**.

---

## ☁️ Access from Anywhere in the World (Free Cloud Hosting)

If you want the database accessible over the public internet (not just local Wi-Fi):

1. Upload this repository to **GitHub** (see instructions below).
2. Go to [Render.com](https://render.com) or [Railway.app](https://railway.app) (both offer free hosting).
3. Create a **New Web Service**, select your GitHub repository.
4. Set Build Command to `npm install` and Start Command to `node server.js`.
5. You will get a live worldwide HTTPS URL (e.g. `https://alexandria-library.onrender.com`).
6. You and your members can now log in from any device, anywhere in the world, 24/7!

---

## 🔐 Login Credentials

| Role | Username | Password | Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **🛡️ Administrator** | **`admin`** | **`123`** | • Full system oversight<br>• Add, edit, remove books & covers<br>• **View & manage members' usernames and passwords**<br>• Add/remove members<br>• Issue and return books for all patrons<br>• Multi-device database control |
| **👤 Member / Patron** | **`marcus`** *(or any member)* | **`123`** | • Access from phone or PC<br>• Browse & search the live book catalog<br>• **Borrow books** directly (with tier quota tracking)<br>• View personal borrowed books & due dates |

> 💡 **Member Self-Registration**: Any new user can click **"Member Sign Up"** from their own device to create a username and password. Their account is immediately saved to the central database and visible to the Admin.

---

## 🌟 Key Features

1. **Central Persistent Database**:
   - Stored safely in `data/library_database.json`.
   - Thread-safe reads and writes.
   - Built-in data backup export and import.

2. **Books Catalog & Cover Images**:
   - Add, edit, delete books with full metadata (ISBN, category, copies, shelf location, synopsis).
   - **Cover Image Upload & Removal**: Upload image files (stored as Base64 in database), paste image URLs, or remove image to use the classic procedural book spine.

3. **Members & Login Management**:
   - Enrolled members with custom usernames and passwords.
   - Admin can view passwords (with single or bulk "Show All" toggle) and reset passwords anytime.
   - Safe de-enrollment prevents deleting patrons with unreturned volumes.

4. **Live Circulation Desk**:
   - Check out / Issue books with due date enforcement.
   - Process returns to restock the live database inventory.

---

## 📁 File Structure

| File | Purpose |
| :--- | :--- |
| [**`server.js`**](file:///C:/Users/USER/.gemini/antigravity/scratch/library-system/server.js) | Central Database and REST API Server (Pure Node.js, zero dependencies) |
| [**`index.html`**](file:///C:/Users/USER/.gemini/antigravity/scratch/library-system/index.html) | Responsive user interface with multi-device status indicator and modal |
| [**`app.js`**](file:///C:/Users/USER/.gemini/antigravity/scratch/library-system/app.js) | Frontend client with live background sync polling and database API calls |
| [**`styles.css`**](file:///C:/Users/USER/.gemini/antigravity/scratch/library-system/styles.css) | Custom styling, badges, animations, and book spines |
| [**`package.json`**](file:///C:/Users/USER/.gemini/antigravity/scratch/library-system/package.json) | Cloud deployment and npm scripts configuration |
