# Alexandria | Professional Library Management System

A modern, responsive, and secure **Library Management Portal** featuring dual **Admin** and **Member** authentication, full book/member catalog management with book image controls, and live borrowing circulation.

---

## 🔐 Login Credentials

The site supports distinct roles with tailored views and permissions:

### 1. 🛡️ Administrator Login
- **Username**: `admin`
- **Password**: `123`
- **Permissions**:
  - Full system management and analytics.
  - **Add, Edit, and Remove Books** (including uploading, changing, or removing book cover images).
  - **View & Manage Member Login Credentials**: The Admin can view each member's username and password (with toggle hide/show), reset their passwords, or edit member profiles.
  - **Issue and Return Books** to any patron.
  - **Edit Institutional Profile** and export/import JSON database backups.

### 2. 👤 Member / Patron Login
- **Default Sample Members**:
  - Username: `marcus` | Password: `123` (Dr. Marcus Chen - Faculty)
  - Username: `sophia` | Password: `123` (Sophia Rodriguez - Premium Scholar)
  - Username: `alex` | Password: `123` (Alexander Kim - Student)
  - Username: `clara` | Password: `123` (Clara Hawthorne - Standard)
- **Self-Registration**: New readers can click **"Member Sign Up"** on the login page to create their own username and password!
- **Member Permissions**:
  - View personal patron dashboard with their active loan quota.
  - Browse, search, and filter the book catalog.
  - **Borrow Books** directly from the catalog with automatic quota tracking.
  - View their borrowed books list and due dates.
  - Protected from unauthorized admin actions (members cannot delete books or access other members' private information).

---

## 🌟 Key Features

### 1. 📚 Books & Cover Image Management
- **Add / Edit Books**: Title, Author, Category, ISBN-13, Year, Copies, Shelf Location, Publisher, Synopsis.
- **Cover Image Upload & Removal**:
  - **File Upload**: Upload image files from your computer (auto-stored as Base64 in LocalStorage).
  - **Image by URL**: Paste web URLs with instant preview.
  - **Remove Image**: One-click removal button clears custom images and falls back to a clean academic procedural book spine.
- **Remove Books**: Confirmation modal with loan checks (prevents deleting checked-out books).
- **Search & Filters**: Live search by title, author, or ISBN; filter by category & stock.
- **Dual Display Modes**: Toggle between Grid Cards and Table View.

### 2. 👥 Members & Credentials Management (Admin Control)
- **Add Members**: Enroll members with Name, Username, Password, Email, Phone, Tier, and Status.
- **View Member Passwords**: Admin can view member passwords in the Members table using the password reveal button (`👁️`).
- **Edit Member Credentials**: Admin can update or reset any member's login username or password at any time.
- **De-enroll / Remove Members**: Guarded to prevent deletion if they have unreturned loans.

### 3. 🔄 Circulation & Loan Tracking
- **Check Out / Issue Books**: Admin can assign books to members; members can borrow books within their tier quota.
- **Return Processing**: Returning a volume automatically restocks available copies.
- **Overdue Detection**: Real-time badges indicating on-time vs. overdue status.

---

## 🚀 How to Run the Website

No build tools or installation needed:

1. Open File Explorer to:
   ```text
   C:\Users\USER\.gemini\antigravity\scratch\library-system\
   ```
2. Double-click **`index.html`** in any web browser (Chrome, Edge, Firefox, Brave).
3. Test logging in as:
   - **Admin**: `admin` / `123`
   - **Member**: `marcus` / `123` (or register a new member account)
