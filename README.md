# Alexandria | Professional Library Management System

A modern, responsive, and feature-complete **Library Management Portal** built for public, academic, and private institutional libraries.

---

## 🌟 Features Included

### 1. 📚 Complete Book Management
- **Add New Books**: Enter Title, Author, Category/Discipline, ISBN-13, Publication Year, Available Copies, Physical Shelf Location, Publisher, and Abstract.
- **Book Cover Image Handling**:
  - **Upload Image**: Directly upload any image file from your computer (automatically converted and stored locally via Base64).
  - **Image by URL**: Paste web image links with instant preview.
  - **Remove Image Option**: One-click removal button clears custom images and gracefully falls back to an elegant, procedurally generated academic book spine and cover.
  - **Live Cover Preview**: Real-time visual feedback before saving.
- **Edit Books**: Update metadata, change cover image, or remove cover images anytime.
- **Remove Books**: Confirmation modal with loan safety verification (prevents deletion if copies are actively checked out).
- **Search & Filters**: Real-time filter by keyword, subject discipline/category, and availability status.
- **Switch Views**: Toggle between visual **Grid Cards** and detailed **Table View**.

### 2. 👥 Member & Scholar Management
- **Enroll Members**: Collect Full Legal Name, Email, Phone, Membership Tier, Account Status, and Residential Address.
- **Membership Tiers**:
  - `Student` (Max 3 books)
  - `Standard Reader` (Max 5 books)
  - `Scholar / Premium` (Max 10 books)
  - `Faculty & Staff` (Max 15 books)
- **Edit & Update**: Modify patron profiles and account statuses (Active, Suspended, Inactive).
- **Remove Members**: Delete accounts with protection against unreturned book loans.

### 3. 🔄 Circulation Desk (Borrow & Return)
- **Check Out / Issue Books**: Select available volumes, assign to active members, and set loan duration.
- **Track Loans**: Monitor active borrowings, due dates, and overdue alerts.
- **Process Returns**: One-click return automatically restocks the book copy count and archives the loan.

### 4. 🏛️ Professional Institutional Details
- **Library Profile**: Customizable Institution Name, Chief Curator/Librarian, Operating Hours, Address, Telephone, and Support Email.
- **Circulation Rules**: Clear loan policy guidelines and quota displays.
- **Data Persistence & Backups**:
  - Automatically saved to browser LocalStorage.
  - **Export JSON**: Download a full backup of all books, images, members, and loans.
  - **Import JSON**: Restore database on any computer.
  - **Reset Demo Data**: Restore default classic catalog with one click.

---

## 🚀 How to Open and Run

No build step or server setup is required. The website is 100% self-contained:

1. Navigate to:
   ```
   C:\Users\USER\.gemini\antigravity\scratch\library-system\
   ```
2. Double-click or right-click and open **`index.html`** in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).
3. Start cataloging books, adding members, and testing cover image uploads/removals immediately!
