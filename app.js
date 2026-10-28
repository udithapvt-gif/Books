/**
 * Alexandria Library Management System - Core Application Logic
 * Comprehensive Authentication (Admin & Member roles),
 * Member Credentials Management (Admin View, Edit, & Reset),
 * Member Self-Registration with Robust Persistence,
 * Book Management with Image Upload/Removal, and Circulation.
 */

// ==========================================
// 1. STORAGE KEYS & INITIAL SEED DATA
// ==========================================

const STORAGE_KEY_BOOKS = 'alexandria_books_v1';
const STORAGE_KEY_MEMBERS = 'alexandria_members_v2'; // Bumped key to ensure clean schema migration
const STORAGE_KEY_LOANS = 'alexandria_loans_v1';
const STORAGE_KEY_LOGS = 'alexandria_logs_v1';
const STORAGE_KEY_PROFILE = 'alexandria_profile_v1';
const STORAGE_KEY_USER = 'alexandria_current_user_v2';

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "123",
  role: "admin",
  name: "Dr. Eleanor Vance (Admin)",
  email: "admin@alexandrialibrary.org"
};

const DEFAULT_PROFILE = {
  name: "Alexandria Athenaeum Central Library",
  tagline: "Preserving human knowledge and fostering discovery since 1924.",
  librarian: "Dr. Eleanor Vance, Ph.D. in Library Sciences",
  hours: "Mon - Sat: 8:00 AM – 9:00 PM | Sun: 10:00 AM – 6:00 PM",
  address: "450 University Boulevard, Academic Quarter, Suite 101",
  phone: "+1 (555) 234-8900",
  email: "curator@alexandrialibrary.org"
};

const DEFAULT_BOOKS = [
  {
    id: "BK-1001",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Computer Science",
    isbn: "978-0132350884",
    year: 2008,
    copies: 5,
    available: 4,
    location: "Shelf CS-03",
    publisher: "Prentice Hall",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. A timeless guide to writing readable, maintainable software.",
    coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BK-1002",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic Literature",
    isbn: "978-0743273565",
    year: 1925,
    copies: 4,
    available: 3,
    location: "Shelf LIT-12",
    publisher: "Charles Scribner's Sons",
    description: "A portrait of the Jazz Age in all its decadence and excess, exploring themes of idealism, social upheaval, and the elusive American Dream.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BK-1003",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science & Physics",
    isbn: "978-0553380163",
    year: 1988,
    copies: 3,
    available: 3,
    location: "Shelf PHY-07",
    publisher: "Bantam Books",
    description: "From the big bang to black holes, Stephen Hawking explores the most profound questions about our universe, time, and cosmic origins in accessible prose.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BK-1004",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    isbn: "978-0062316097",
    year: 2014,
    copies: 6,
    available: 5,
    location: "Shelf HIST-02",
    publisher: "Harper",
    description: "How did an insignificant ape become the ruler of planet Earth? Harari recounts the evolutionary and cultural breakthroughs that shaped human civilization.",
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "BK-1005",
    title: "The Republic",
    author: "Plato",
    category: "Philosophy",
    isbn: "978-0140455526",
    year: -375,
    copies: 3,
    available: 2,
    location: "Shelf PHIL-01",
    publisher: "Penguin Classics",
    description: "Plato's seminal dialogue examining justice, the nature of the philosopher king, the ideal society, and the allegory of the cave.",
    coverImage: ""
  },
  {
    id: "BK-1006",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    category: "Computer Science",
    isbn: "978-0201633610",
    year: 1994,
    copies: 4,
    available: 4,
    location: "Shelf CS-05",
    publisher: "Addison-Wesley",
    description: "The foundational 'Gang of Four' classic cataloging 23 recurring software design patterns that solve common object-oriented design problems.",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
  }
];

// Default members with guaranteed usernames and passwords
const DEFAULT_MEMBERS = [
  {
    id: "MEM-1001",
    name: "Dr. Marcus Chen",
    username: "marcus",
    password: "123",
    email: "marcus.chen@university.edu",
    phone: "+1 (555) 349-8102",
    tier: "Faculty",
    joinDate: "2024-01-15",
    status: "Active",
    address: "88 Academic Way, Campus Tower B"
  },
  {
    id: "MEM-1002",
    name: "Sophia Rodriguez",
    username: "sophia",
    password: "123",
    email: "sophia.rodriguez@gmail.com",
    phone: "+1 (555) 782-9341",
    tier: "Premium",
    joinDate: "2024-03-22",
    status: "Active",
    address: "142 Elmwood Street, Apt 4C"
  },
  {
    id: "MEM-1003",
    name: "Alexander Kim",
    username: "alex",
    password: "123",
    email: "a.kim@student.edu",
    phone: "+1 (555) 604-1189",
    tier: "Student",
    joinDate: "2024-08-10",
    status: "Active",
    address: "North Dormitory Hall, Room 314"
  },
  {
    id: "MEM-1004",
    name: "Clara Hawthorne",
    username: "clara",
    password: "123",
    email: "clara.hawthorne@literary.org",
    phone: "+1 (555) 492-3084",
    tier: "Standard",
    joinDate: "2024-09-01",
    status: "Active",
    address: "27 Highland Gardens, West End"
  }
];

const DEFAULT_LOANS = [
  {
    id: "LN-5001",
    bookId: "BK-1001",
    memberId: "MEM-1003",
    borrowDate: "2026-10-18",
    dueDate: "2026-11-01",
    returnDate: null,
    status: "Active"
  },
  {
    id: "LN-5002",
    bookId: "BK-1002",
    memberId: "MEM-1002",
    borrowDate: "2026-10-14",
    dueDate: "2026-10-28",
    returnDate: null,
    status: "Due Today"
  },
  {
    id: "LN-5003",
    bookId: "BK-1004",
    memberId: "MEM-1001",
    borrowDate: "2026-10-20",
    dueDate: "2026-11-03",
    returnDate: null,
    status: "Active"
  },
  {
    id: "LN-5004",
    bookId: "BK-1005",
    memberId: "MEM-1004",
    borrowDate: "2026-10-22",
    dueDate: "2026-11-05",
    returnDate: null,
    status: "Active"
  }
];

const DEFAULT_LOGS = [
  { text: "System initialized with Alexandria v2.5 Auth & Catalog", time: "Just now", type: "system" },
  { text: "Dr. Marcus Chen checked out 'Clean Code'", time: "Oct 18, 2026", type: "loan" },
  { text: "Sophia Rodriguez renewed membership to Premium Tier", time: "Oct 15, 2026", type: "member" },
  { text: "New volume 'Design Patterns' accessioned to Shelf CS-05", time: "Oct 10, 2026", type: "book" }
];

// App State
let books = [];
let members = [];
let loans = [];
let logs = [];
let libraryProfile = {};
let currentUser = null; // { role: 'admin'|'member', username, name, id?, tier? }

// Tracking revealed passwords in admin table
let revealedPasswords = new Set();
let allPasswordsRevealed = false;

// View and filter states
let currentView = 'dashboard';
let bookViewMode = 'grid';
let activeDeleteTarget = null;
let currentModalCoverImage = null;

// ==========================================
// 2. DATA SANITIZATION & MIGRATION
// ==========================================

/**
 * Ensures every member record ALWAYS has valid, non-empty username and password strings.
 * Seamlessly upgrades any legacy localStorage data.
 */
function sanitizeMembersList(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return JSON.parse(JSON.stringify(DEFAULT_MEMBERS));
  }

  const defaultCredsMap = {
    "MEM-1001": { username: "marcus", password: "123" },
    "MEM-1002": { username: "sophia", password: "123" },
    "MEM-1003": { username: "alex", password: "123" },
    "MEM-1004": { username: "clara", password: "123" }
  };

  return rawList.map((m, idx) => {
    let username = (m.username || '').toString().trim();
    let password = (m.password || '').toString().trim();

    // If username is missing, assign from map or generate from name
    if (!username) {
      if (defaultCredsMap[m.id]) {
        username = defaultCredsMap[m.id].username;
      } else if (m.name) {
        const cleanName = m.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        username = cleanName.slice(0, 8) || `member${idx + 1}`;
      } else {
        username = `member${idx + 1}`;
      }
    }

    // If password is missing, set to 123
    if (!password) {
      if (defaultCredsMap[m.id]) {
        password = defaultCredsMap[m.id].password;
      } else {
        password = "123";
      }
    }

    return {
      id: m.id || `MEM-${1000 + idx + 1}`,
      name: m.name || `Member ${idx + 1}`,
      username: username,
      password: password,
      email: m.email || `${username}@library.org`,
      phone: m.phone || '+1 555-0100',
      tier: m.tier || 'Standard',
      status: m.status || 'Active',
      address: m.address || 'Patron Address',
      joinDate: m.joinDate || '2024-01-01'
    };
  });
}

function loadData() {
  const storedBooks = localStorage.getItem(STORAGE_KEY_BOOKS);
  // Check v2 key first, then fallback to v1 for backwards compatibility
  const storedMembers = localStorage.getItem(STORAGE_KEY_MEMBERS) || localStorage.getItem('alexandria_members_v1');
  const storedLoans = localStorage.getItem(STORAGE_KEY_LOANS);
  const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
  const storedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);

  books = storedBooks ? JSON.parse(storedBooks) : [...DEFAULT_BOOKS];

  // Parse and strictly sanitize members list
  let rawMembers = null;
  if (storedMembers) {
    try {
      rawMembers = JSON.parse(storedMembers);
    } catch (e) {
      rawMembers = null;
    }
  }
  members = sanitizeMembersList(rawMembers);

  loans = storedLoans ? JSON.parse(storedLoans) : [...DEFAULT_LOANS];
  logs = storedLogs ? JSON.parse(storedLogs) : [...DEFAULT_LOGS];
  libraryProfile = storedProfile ? JSON.parse(storedProfile) : { ...DEFAULT_PROFILE };

  saveData();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
  localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(loans));
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(libraryProfile));
  
  if (currentUser) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

function logActivity(text, type = 'info') {
  const newLog = {
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: type
  };
  logs.unshift(newLog);
  if (logs.length > 25) logs.pop();
  saveData();
  if (currentView === 'dashboard') renderDashboard();
}

// ==========================================
// 3. AUTHENTICATION & LOGIN LOGIC
// ==========================================

function initSystem() {
  loadData();
  setupEventListeners();
  populateCategoryFilter();

  // Restore active user session if valid
  const storedUser = localStorage.getItem(STORAGE_KEY_USER);
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === 'admin') {
        currentUser = parsed;
      } else if (parsed.role === 'member') {
        const matchingMember = members.find(m => 
          m.id === parsed.id || m.username.toLowerCase() === (parsed.username || '').toLowerCase()
        );
        if (matchingMember) {
          currentUser = { ...matchingMember, role: 'member' };
        } else {
          currentUser = null;
        }
      }
    } catch (e) {
      currentUser = null;
    }
  }

  applyAuthState();
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('tab-btn-login');
  const regTab = document.getElementById('tab-btn-register');
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');

  if (tab === 'login') {
    loginTab.className = "flex-1 py-3 text-center border-b-2 border-indigo-600 text-indigo-700 bg-white font-bold transition";
    regTab.className = "flex-1 py-3 text-center border-b-2 border-transparent text-slate-600 hover:text-slate-900 transition";
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
  } else {
    regTab.className = "flex-1 py-3 text-center border-b-2 border-emerald-600 text-emerald-700 bg-white font-bold transition";
    loginTab.className = "flex-1 py-3 text-center border-b-2 border-transparent text-slate-600 hover:text-slate-900 transition";
    regForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

function quickFillCredentials(user, pass) {
  switchAuthTab('login');
  document.getElementById('login-username').value = user;
  document.getElementById('login-password').value = pass;
}

function toggleInputPassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fa-regular fa-eye-slash text-xs"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fa-regular fa-eye text-xs"></i>';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = (document.getElementById('login-username').value || '').trim();
  const password = (document.getElementById('login-password').value || '').trim();

  if (!username || !password) {
    showToast('Please enter both username and password.', 'error');
    return;
  }

  // 1. Check Admin Login (admin / 123)
  if (username.toLowerCase() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    currentUser = {
      role: 'admin',
      username: 'admin',
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email
    };
    saveData();
    applyAuthState();
    showToast(`Welcome back, Administrator!`, 'success');
    logActivity('Admin signed in to management console', 'system');
    return;
  }

  // 2. Check Member Login (case-insensitive username match, exact password match)
  const member = members.find(m => 
    (m.username || '').toLowerCase() === username.toLowerCase() && 
    (m.password || '') === password
  );

  if (member) {
    if (member.status === 'Suspended') {
      showToast('Your account is currently suspended. Please contact the library administrator.', 'error');
      return;
    }

    currentUser = {
      ...member,
      role: 'member'
    };
    saveData();
    applyAuthState();
    showToast(`Welcome back, ${member.name}!`, 'success');
    logActivity(`Member '${member.name}' (${member.username}) signed in`, 'member');
    return;
  }

  showToast('Invalid username or password. Check credentials and try again.', 'error');
}

// Self-Registration for New Members
function handleRegister(event) {
  event.preventDefault();

  const name = (document.getElementById('reg-name').value || '').trim();
  const username = (document.getElementById('reg-username').value || '').trim();
  const password = (document.getElementById('reg-password').value || '').trim();
  const email = (document.getElementById('reg-email')?.value || '').trim();
  const phone = (document.getElementById('reg-phone')?.value || '').trim();
  const tier = document.getElementById('reg-tier')?.value || 'Standard';

  if (!name || !username || !password) {
    showToast('Please provide Name, Username, and Password.', 'error');
    return;
  }

  // Check username uniqueness
  const cleanUsername = username.toLowerCase();
  if (cleanUsername === 'admin' || members.some(m => (m.username || '').toLowerCase() === cleanUsername)) {
    showToast(`Username '${username}' is already taken. Please choose another username.`, 'error');
    return;
  }

  const newId = `MEM-${1000 + members.length + 1}`;
  const newMember = {
    id: newId,
    name: name,
    username: username,
    password: password,
    email: email || `${username}@library.org`,
    phone: phone || '+1 555-0199',
    tier: tier,
    status: 'Active',
    address: 'Registered Online',
    joinDate: new Date().toISOString().split('T')[0]
  };

  // Add to members list and persist immediately
  members.push(newMember);
  currentUser = { ...newMember, role: 'member' };
  
  saveData();
  logActivity(`New member registered account: ${name} (User: ${username})`, 'member');

  // Reset form
  document.getElementById('form-register').reset();

  applyAuthState();
  showToast(`Account created successfully! Welcome to Alexandria, ${name}!`, 'success');
}

function handleLogout() {
  currentUser = null;
  saveData();
  applyAuthState();
  showToast('You have signed out successfully.', 'info');
}

function applyAuthState() {
  const authScreen = document.getElementById('auth-screen');
  const mainApp = document.getElementById('main-app');

  if (!currentUser) {
    authScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    return;
  }

  authScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');

  const isAdmin = currentUser.role === 'admin';

  // Toggle admin-only controls
  document.querySelectorAll('.admin-only').forEach(el => {
    if (isAdmin) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  // User badge and sidebar
  const userRoleEl = document.getElementById('sidebar-user-role');
  const userNameEl = document.getElementById('sidebar-user-name');
  const userAvatarEl = document.getElementById('sidebar-user-avatar');
  const topBadgeEl = document.getElementById('top-user-badge');

  if (isAdmin) {
    userRoleEl.innerText = "Administrator";
    userRoleEl.className = "text-[11px] text-amber-400 font-bold";
    userNameEl.innerText = currentUser.name;
    userAvatarEl.innerHTML = `<i class="fa-solid fa-user-shield text-amber-400"></i>`;
    topBadgeEl.innerHTML = `<i class="fa-solid fa-user-shield text-amber-500 mr-1"></i> Admin (${currentUser.username})`;
    topBadgeEl.className = "px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200";

    document.getElementById('nav-circulation-label').innerText = "Circulation / Loans";
    document.getElementById('dash-role-badge').innerHTML = `<i class="fa-solid fa-user-shield"></i> Administrator Dashboard`;
    document.getElementById('dash-greeting').innerText = `Welcome to The Alexandria Athenaeum`;
  } else {
    userRoleEl.innerText = `${currentUser.tier} Patron`;
    userRoleEl.className = "text-[11px] text-emerald-400 font-semibold";
    userNameEl.innerText = currentUser.name;
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    userAvatarEl.innerHTML = `<span>${initials}</span>`;
    topBadgeEl.innerHTML = `<i class="fa-solid fa-id-card text-emerald-500 mr-1"></i> Member: ${currentUser.name} (${currentUser.tier})`;
    topBadgeEl.className = "px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200";

    document.getElementById('nav-circulation-label').innerText = "My Borrowed Books";
    document.getElementById('dash-role-badge').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Member Scholar Portal`;
    document.getElementById('dash-greeting').innerText = `Welcome back, ${currentUser.name.split(' ')[0]}!`;
  }

  switchView('dashboard');
}

// ==========================================
// 4. NAVIGATION & VIEWS
// ==========================================

function switchView(viewName) {
  if (currentUser && currentUser.role !== 'admin' && (viewName === 'members' || viewName === 'library-info')) {
    viewName = 'dashboard';
  }

  currentView = viewName;
  const views = ['dashboard', 'books', 'members', 'circulation', 'library-info'];

  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const navBtn = document.getElementById(`nav-${v}`);
    if (el) {
      if (v === viewName) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
    if (navBtn) {
      if (v === viewName) {
        navBtn.classList.add('active', 'bg-slate-800', 'text-white');
        navBtn.classList.remove('text-slate-400');
      } else {
        navBtn.classList.remove('active', 'bg-slate-800', 'text-white');
        navBtn.classList.add('text-slate-400');
      }
    }
  });

  const isAdmin = currentUser && currentUser.role === 'admin';
  const titleMap = {
    'dashboard': { 
      title: isAdmin ? "System Dashboard" : "Patron Dashboard", 
      subtitle: isAdmin ? "Catalog overview, active scholar statistics, and operations" : "Your active book loans, personal reading list, and discovery" 
    },
    'books': { 
      title: "Books Catalog", 
      subtitle: isAdmin ? "Catalog, add, edit, remove, and manage book volumes & cover art" : "Search and borrow physical and digital book volumes" 
    },
    'members': { 
      title: "Members & Credentials Management", 
      subtitle: "View patron records, contact details, and manage login usernames & passwords" 
    },
    'circulation': { 
      title: isAdmin ? "Circulation Desk" : "My Borrowed Books & Loans", 
      subtitle: isAdmin ? "Manage volume checkouts, returns, and overdue dates" : "Track due dates, loan periods, and return books" 
    },
    'library-info': { 
      title: "Institutional Profile", 
      subtitle: "Operating schedule, loan guidelines, and system backup management" 
    }
  };

  if (titleMap[viewName]) {
    document.getElementById('page-title').innerText = titleMap[viewName].title;
    document.getElementById('page-subtitle').innerText = titleMap[viewName].subtitle;
  }

  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'books') renderBooks();
  if (viewName === 'members') renderMembers();
  if (viewName === 'circulation') renderCirculation();
  if (viewName === 'library-info') renderLibraryProfile();

  updateBadges();
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

function setBookView(mode) {
  bookViewMode = mode;
  const btnGrid = document.getElementById('btn-book-view-grid');
  const btnTable = document.getElementById('btn-book-view-table');

  if (mode === 'grid') {
    btnGrid.className = "px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-indigo-700 shadow-xs transition";
    btnTable.className = "px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition";
  } else {
    btnTable.className = "px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-indigo-700 shadow-xs transition";
    btnGrid.className = "px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition";
  }

  renderBooks();
}

function updateBadges() {
  const badgeBooks = document.getElementById('badge-total-books');
  const badgeMembers = document.getElementById('badge-total-members');
  const badgeLoans = document.getElementById('badge-active-loans');

  const isAdmin = currentUser && currentUser.role === 'admin';
  const relevantLoans = isAdmin 
    ? loans.filter(l => !l.returnDate)
    : loans.filter(l => l.memberId === currentUser.id && !l.returnDate);

  if (badgeBooks) badgeBooks.innerText = books.length;
  if (badgeMembers) badgeMembers.innerText = members.length;
  if (badgeLoans) badgeLoans.innerText = relevantLoans.length;
}

// ==========================================
// 5. DASHBOARD VIEW
// ==========================================

function renderDashboard() {
  const isAdmin = currentUser && currentUser.role === 'admin';
  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, b) => sum + (parseInt(b.copies) || 1), 0);
  const totalAvailable = books.reduce((sum, b) => sum + (parseInt(b.available) || 0), 0);
  const uniqueCategories = new Set(books.map(b => b.category)).size;

  document.getElementById('dash-kpi-books').innerText = totalBooks;
  document.getElementById('dash-kpi-available').innerText = `${totalAvailable} / ${totalCopies} Available`;
  document.getElementById('dash-kpi-categories').innerText = uniqueCategories;

  const kpi2Title = document.getElementById('dash-kpi2-title');
  const kpi2Val = document.getElementById('dash-kpi-members');
  const kpi2Desc = document.getElementById('dash-kpi2-desc');

  const kpi3Title = document.getElementById('dash-kpi3-title');
  const kpi3Val = document.getElementById('dash-kpi-issued');
  const kpi3Desc = document.getElementById('dash-kpi3-desc');

  if (isAdmin) {
    kpi2Title.innerText = "Registered Members";
    kpi2Val.innerText = members.length;
    kpi2Desc.innerText = `${members.filter(m => m.status === 'Active').length} Active accounts`;

    kpi3Title.innerText = "Books Checked Out";
    kpi3Val.innerText = loans.filter(l => !l.returnDate).length;
    kpi3Desc.innerText = "Active borrower loans";
    document.getElementById('dash-loans-heading').innerText = "Active Library Loans";
  } else {
    const myActiveLoans = loans.filter(l => l.memberId === currentUser.id && !l.returnDate);
    const tierLimits = { 'Student': 3, 'Standard': 5, 'Premium': 10, 'Faculty': 15 };
    const myLimit = tierLimits[currentUser.tier] || 5;

    kpi2Title.innerText = "My Loan Quota";
    kpi2Val.innerText = `${myActiveLoans.length} / ${myLimit}`;
    kpi2Desc.innerText = `${currentUser.tier} Tier Allowance`;

    kpi3Title.innerText = "My Active Loans";
    kpi3Val.innerText = myActiveLoans.length;
    kpi3Desc.innerText = "Books in your possession";
    document.getElementById('dash-loans-heading').innerText = "My Borrowed Books";
  }

  // Recent Books
  const recentBooksContainer = document.getElementById('dash-recent-books');
  recentBooksContainer.innerHTML = '';
  const recentList = [...books].reverse().slice(0, 4);

  recentList.forEach(book => {
    const card = document.createElement('div');
    card.className = "book-card bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-between";
    card.onclick = () => viewBookDetails(book.id);

    const coverHtml = book.coverImage
      ? `<img src="${escapeHtml(book.coverImage)}" alt="${escapeHtml(book.title)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">`
      : generateProceduralCoverHtml(book);

    card.innerHTML = `
      <div class="book-cover-container aspect-[2/3] w-full overflow-hidden relative">
        ${coverHtml}
        <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${book.available > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}">
          ${book.available > 0 ? `${book.available} left` : 'Loaned out'}
        </span>
      </div>
      <div class="p-3">
        <h5 class="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition">${escapeHtml(book.title)}</h5>
        <p class="text-[11px] text-slate-500 line-clamp-1">${escapeHtml(book.author)}</p>
      </div>
    `;
    recentBooksContainer.appendChild(card);
  });

  // Active Loans mini list
  const activeLoansContainer = document.getElementById('dash-active-loans');
  activeLoansContainer.innerHTML = '';

  const relevantLoans = isAdmin
    ? loans.filter(l => !l.returnDate).slice(0, 4)
    : loans.filter(l => l.memberId === currentUser.id && !l.returnDate).slice(0, 4);

  if (relevantLoans.length === 0) {
    activeLoansContainer.innerHTML = `<p class="text-xs text-slate-400 italic">${isAdmin ? 'No books currently checked out.' : 'You have no books currently on loan.'}</p>`;
  } else {
    relevantLoans.forEach(loan => {
      const book = books.find(b => b.id === loan.bookId) || { title: 'Unknown Title' };
      const member = members.find(m => m.id === loan.memberId) || { name: 'Unknown' };

      const item = document.createElement('div');
      item.className = "p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs";
      item.innerHTML = `
        <div class="space-y-0.5">
          <p class="font-semibold text-slate-800 line-clamp-1">${escapeHtml(book.title)}</p>
          <p class="text-[11px] text-slate-500">${isAdmin ? `Borrower: ${escapeHtml(member.name)}` : `Due: ${loan.dueDate}`}</p>
        </div>
        <button onclick="handleReturnBook('${loan.id}')" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-[11px] transition">
          Return
        </button>
      `;
      activeLoansContainer.appendChild(item);
    });
  }

  // Activity Log
  const logContainer = document.getElementById('dash-activity-log');
  logContainer.innerHTML = '';
  logs.slice(0, 5).forEach(log => {
    const li = document.createElement('li');
    li.className = "flex items-start gap-2.5";
    li.innerHTML = `
      <i class="fa-solid fa-circle-dot text-[9px] text-indigo-500 mt-1"></i>
      <div class="flex-1">
        <p class="text-slate-700 font-medium">${escapeHtml(log.text)}</p>
        <span class="text-[10px] text-slate-400">${escapeHtml(log.time)}</span>
      </div>
    `;
    logContainer.appendChild(li);
  });
}

function generateProceduralCoverHtml(book) {
  const gradients = [
    'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
    'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #451a03 100%)',
    'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)',
    'linear-gradient(135deg, #374151 0%, #111827 100%)'
  ];
  const charCode = (book.title ? book.title.charCodeAt(0) : 0) % gradients.length;
  const bg = gradients[charCode];

  return `
    <div class="procedural-cover text-white select-none" style="background: ${bg};">
      <div class="space-y-1">
        <span class="text-[9px] tracking-widest uppercase font-bold text-amber-300 opacity-90">${escapeHtml(book.category || 'Library Volume')}</span>
        <h4 class="font-serif font-bold text-sm leading-snug line-clamp-3">${escapeHtml(book.title)}</h4>
      </div>
      <div class="space-y-2 pt-4 border-t border-white/20">
        <p class="text-[11px] text-slate-200 line-clamp-1 italic font-light">${escapeHtml(book.author || 'Unknown Author')}</p>
        <div class="flex justify-between items-center text-[10px] text-slate-300">
          <span>${book.year ? book.year : 'Alexandria'}</span>
          <i class="fa-solid fa-feather text-amber-300/80"></i>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 6. BOOKS CATALOG (WITH COVER IMAGE CONTROLS)
// ==========================================

function renderBooks() {
  const search = (document.getElementById('book-search-input')?.value || '').toLowerCase().trim();
  const categoryFilter = document.getElementById('book-category-filter')?.value || 'ALL';
  const statusFilter = document.getElementById('book-status-filter')?.value || 'ALL';
  const isAdmin = currentUser && currentUser.role === 'admin';

  const filtered = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      (book.isbn && book.isbn.toLowerCase().includes(search));

    const matchesCategory = categoryFilter === 'ALL' || book.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === 'AVAILABLE') matchesStatus = (book.available > 0);
    if (statusFilter === 'UNAVAILABLE') matchesStatus = (book.available <= 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const showingCount = document.getElementById('books-showing-count');
  if (showingCount) showingCount.innerText = filtered.length;

  const gridContainer = document.getElementById('books-grid-container');
  const tableContainer = document.getElementById('books-table-container');
  const tableBody = document.getElementById('books-table-body');
  const emptyState = document.getElementById('books-empty-state');

  if (filtered.length === 0) {
    gridContainer.classList.add('hidden');
    tableContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  if (bookViewMode === 'grid') {
    gridContainer.classList.remove('hidden');
    tableContainer.classList.add('hidden');
    gridContainer.innerHTML = '';

    filtered.forEach(book => {
      const card = document.createElement('div');
      card.className = "book-card bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between";

      const coverHtml = book.coverImage
        ? `<img src="${escapeHtml(book.coverImage)}" alt="${escapeHtml(book.title)}" class="w-full h-full object-cover">`
        : generateProceduralCoverHtml(book);

      const statusBadge = book.available > 0
        ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold badge-available"><i class="fa-solid fa-circle-check mr-1 text-[10px]"></i> ${book.available}/${book.copies} Available</span>`
        : `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold badge-out-of-stock"><i class="fa-solid fa-circle-xmark mr-1 text-[10px]"></i> Out of Stock</span>`;

      let actionBarHtml = '';
      if (isAdmin) {
        actionBarHtml = `
          <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
            <button onclick="viewBookDetails('${book.id}')" class="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            <div class="flex items-center gap-1.5">
              <button onclick="openEditBookModal('${book.id}')" title="Edit Book or Image" class="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="confirmDeleteBook('${book.id}')" title="Remove Book" class="p-2 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      } else {
        actionBarHtml = `
          <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
            <button onclick="viewBookDetails('${book.id}')" class="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            ${book.available > 0 ? `
              <button onclick="quickMemberBorrow('${book.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1">
                <i class="fa-solid fa-arrow-right-arrow-left"></i> Borrow
              </button>
            ` : `
              <span class="text-xs text-rose-500 font-medium italic">Checked Out</span>
            `}
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="book-cover-container relative aspect-[2/3] w-full overflow-hidden cursor-pointer" onclick="viewBookDetails('${book.id}')">
            ${coverHtml}
            <div class="absolute top-2.5 right-2.5">
              ${statusBadge}
            </div>
            ${book.coverImage ? `
              <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md">
                <i class="fa-regular fa-image mr-1"></i> Custom Cover
              </div>
            ` : `
              <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-slate-300 text-[10px] px-2 py-0.5 rounded-md">
                <i class="fa-solid fa-palette mr-1"></i> Standard Spine
              </div>
            `}
          </div>

          <div class="p-4 space-y-2">
            <span class="text-[10px] uppercase font-bold text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">${escapeHtml(book.category)}</span>
            <h4 class="font-bold text-slate-900 text-sm font-serif line-clamp-1 hover:text-indigo-600 cursor-pointer" onclick="viewBookDetails('${book.id}')">
              ${escapeHtml(book.title)}
            </h4>
            <p class="text-xs text-slate-600 font-medium line-clamp-1">by ${escapeHtml(book.author)}</p>
            <div class="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
              <span><i class="fa-solid fa-location-dot mr-1 text-slate-400"></i> ${escapeHtml(book.location || 'Main Shelf')}</span>
              <span>${book.year || 'N/A'}</span>
            </div>
          </div>
        </div>

        ${actionBarHtml}
      `;
      gridContainer.appendChild(card);
    });

  } else {
    // Table View
    gridContainer.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    tableBody.innerHTML = '';

    filtered.forEach(book => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-50/80 transition";

      const smallThumb = book.coverImage
        ? `<img src="${escapeHtml(book.coverImage)}" class="w-10 h-14 object-cover rounded shadow-xs">`
        : `<div class="w-10 h-14 rounded bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold"><i class="fa-solid fa-book"></i></div>`;

      let actionsCell = '';
      if (isAdmin) {
        actionsCell = `
          <button onclick="viewBookDetails('${book.id}')" class="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition" title="Inspect">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button onclick="openEditBookModal('${book.id}')" class="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="confirmDeleteBook('${book.id}')" class="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Remove">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;
      } else {
        actionsCell = `
          <button onclick="viewBookDetails('${book.id}')" class="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition">
            <i class="fa-solid fa-eye mr-1"></i> Details
          </button>
          ${book.available > 0 ? `
            <button onclick="quickMemberBorrow('${book.id}')" class="px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
              Borrow
            </button>
          ` : `
            <span class="text-xs text-rose-500 italic px-2">Unavailable</span>
          `}
        `;
      }

      tr.innerHTML = `
        <td class="py-3 px-4 flex items-center gap-3">
          ${smallThumb}
          <div>
            <p class="font-bold text-slate-900 cursor-pointer hover:text-indigo-600" onclick="viewBookDetails('${book.id}')">${escapeHtml(book.title)}</p>
            <p class="text-xs text-slate-500">by ${escapeHtml(book.author)} • <span class="text-slate-400">${book.location || 'Shelf A'}</span></p>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">${escapeHtml(book.category)}</span>
        </td>
        <td class="py-3 px-4 text-xs font-mono text-slate-600">${escapeHtml(book.isbn || '—')}</td>
        <td class="py-3 px-4 text-xs font-medium">
          <span class="${book.available > 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}">${book.available}</span> of ${book.copies}
        </td>
        <td class="py-3 px-4">
          ${book.available > 0 
            ? `<span class="badge-available px-2 py-0.5 rounded-full text-xs font-medium">Available</span>`
            : `<span class="badge-out-of-stock px-2 py-0.5 rounded-full text-xs font-medium">Out of Stock</span>`}
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          ${actionsCell}
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }
}

function filterBooks() {
  renderBooks();
}

function populateCategoryFilter() {
  const catFilter = document.getElementById('book-category-filter');
  if (!catFilter) return;

  const currentSelection = catFilter.value;
  const categories = Array.from(new Set(books.map(b => b.category))).sort();

  catFilter.innerHTML = '<option value="ALL">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.innerText = cat;
    if (cat === currentSelection) opt.selected = true;
    catFilter.appendChild(opt);
  });
}

function handleBookImageFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Image file too large! Maximum 5MB.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    setBookModalImage(e.target.result);
    document.getElementById('book-url-input').value = '';
    showToast('Cover image loaded successfully!', 'success');
  };
  reader.readAsDataURL(file);
}

function handleBookImageUrl(url) {
  const trimmed = url.trim();
  if (trimmed) {
    setBookModalImage(trimmed);
  } else {
    removeBookImage();
  }
}

function setBookModalImage(imageSrc) {
  currentModalCoverImage = imageSrc;
  const preview = document.getElementById('book-image-preview');
  const placeholder = document.getElementById('book-image-placeholder');
  const overlay = document.getElementById('book-image-action-overlay');
  const removeBtn = document.getElementById('btn-remove-image');

  if (imageSrc) {
    preview.src = imageSrc;
    preview.classList.remove('hidden');
    placeholder.classList.add('hidden');
    overlay.classList.remove('hidden');
    removeBtn.classList.remove('hidden');
  } else {
    preview.src = '';
    preview.classList.add('hidden');
    placeholder.classList.remove('hidden');
    overlay.classList.add('hidden');
    removeBtn.classList.add('hidden');
  }
}

function removeBookImage() {
  currentModalCoverImage = null;
  document.getElementById('book-image-preview').src = '';
  document.getElementById('book-image-preview').classList.add('hidden');
  document.getElementById('book-image-placeholder').classList.remove('hidden');
  document.getElementById('book-image-action-overlay').classList.add('hidden');
  document.getElementById('btn-remove-image').classList.add('hidden');
  document.getElementById('book-file-input').value = '';
  document.getElementById('book-url-input').value = '';
  showToast('Book cover image removed. Standard academic cover will be used.', 'info');
}

function handleSaveBook(event) {
  event.preventDefault();

  const id = document.getElementById('book-form-id').value;
  const title = document.getElementById('book-input-title').value.trim();
  const author = document.getElementById('book-input-author').value.trim();
  const category = document.getElementById('book-input-category').value.trim();
  const isbn = document.getElementById('book-input-isbn').value.trim();
  const year = parseInt(document.getElementById('book-input-year').value) || null;
  const copies = parseInt(document.getElementById('book-input-copies').value) || 1;
  const location = document.getElementById('book-input-location').value.trim();
  const publisher = document.getElementById('book-input-publisher').value.trim();
  const desc = document.getElementById('book-input-desc').value.trim();

  if (!title || !author || !category) {
    showToast('Please fill in all mandatory book information.', 'error');
    return;
  }

  if (id) {
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      const existing = books[index];
      const difference = copies - existing.copies;
      const newAvailable = Math.max(0, existing.available + difference);

      books[index] = {
        ...existing,
        title,
        author,
        category,
        isbn,
        year,
        copies,
        available: newAvailable,
        location,
        publisher,
        description: desc,
        coverImage: currentModalCoverImage || ''
      };

      logActivity(`Updated volume '${title}' (Cover ${currentModalCoverImage ? 'updated' : 'removed/default'})`, 'book');
      showToast(`Book '${title}' updated successfully!`, 'success');
    }
  } else {
    const newId = `BK-${1000 + books.length + 1}`;
    const newBook = {
      id: newId,
      title,
      author,
      category,
      isbn,
      year,
      copies,
      available: copies,
      location,
      publisher,
      description: desc,
      coverImage: currentModalCoverImage || ''
    };

    books.push(newBook);
    logActivity(`Cataloged new book '${title}' by ${author}`, 'book');
    showToast(`New book '${title}' cataloged into Alexandria!`, 'success');
  }

  saveData();
  closeModal('modal-add-book');
  populateCategoryFilter();
  renderBooks();
  renderDashboard();
  updateBadges();
}

function openEditBookModal(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  document.getElementById('modal-book-title').innerText = "Edit Book Record & Cover";
  document.getElementById('book-form-id').value = book.id;
  document.getElementById('book-input-title').value = book.title;
  document.getElementById('book-input-author').value = book.author;
  document.getElementById('book-input-category').value = book.category;
  document.getElementById('book-input-isbn').value = book.isbn || '';
  document.getElementById('book-input-year').value = book.year || '';
  document.getElementById('book-input-copies').value = book.copies;
  document.getElementById('book-input-location').value = book.location || '';
  document.getElementById('book-input-publisher').value = book.publisher || '';
  document.getElementById('book-input-desc').value = book.description || '';

  if (book.coverImage) {
    setBookModalImage(book.coverImage);
    if (book.coverImage.startsWith('http')) {
      document.getElementById('book-url-input').value = book.coverImage;
    }
  } else {
    removeBookImage();
  }

  closeModal('modal-book-details');
  openModal('modal-add-book');
}

function viewBookDetails(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  document.getElementById('detail-book-title').innerText = book.title;
  document.getElementById('detail-book-author').innerText = `by ${book.author}`;
  document.getElementById('detail-book-category').innerText = book.category;
  document.getElementById('detail-book-isbn').innerText = book.isbn || 'Unassigned';
  document.getElementById('detail-book-year').innerText = book.year || 'Historical';
  document.getElementById('detail-book-loc').innerText = book.location || 'Wing A, General Stacks';
  document.getElementById('detail-book-desc').innerText = book.description || 'No detailed synopsis provided for this volume.';
  
  const stockEl = document.getElementById('detail-book-stock');
  stockEl.innerText = `${book.available} of ${book.copies} Copies Available`;
  stockEl.className = book.available > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';

  const coverContainer = document.getElementById('detail-book-cover');
  if (book.coverImage) {
    coverContainer.innerHTML = `<img src="${escapeHtml(book.coverImage)}" class="w-full h-full object-cover">`;
  } else {
    coverContainer.innerHTML = generateProceduralCoverHtml(book);
  }

  const isAdmin = currentUser && currentUser.role === 'admin';
  const memberBorrowBtn = document.getElementById('detail-btn-member-borrow');

  if (isAdmin) {
    memberBorrowBtn.classList.add('hidden');
    document.getElementById('detail-btn-edit').onclick = () => openEditBookModal(book.id);
    document.getElementById('detail-btn-delete').onclick = () => confirmDeleteBook(book.id);
  } else {
    if (book.available > 0) {
      memberBorrowBtn.classList.remove('hidden');
      memberBorrowBtn.onclick = () => {
        closeModal('modal-book-details');
        quickMemberBorrow(book.id);
      };
    } else {
      memberBorrowBtn.classList.add('hidden');
    }
  }

  openModal('modal-book-details');
}

function confirmDeleteBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const activeLoansForBook = loans.filter(l => l.bookId === bookId && !l.returnDate);
  if (activeLoansForBook.length > 0) {
    showToast(`Cannot remove '${book.title}'. ${activeLoansForBook.length} copy is currently checked out!`, 'error');
    return;
  }

  activeDeleteTarget = {
    type: 'book',
    id: book.id,
    name: book.title
  };

  document.getElementById('delete-confirm-title').innerText = "Remove Book from Catalog";
  document.getElementById('delete-confirm-desc').innerText = `Are you sure you want to permanently delete "${book.title}" from the library system?`;
  
  closeModal('modal-book-details');
  openModal('modal-confirm-delete');
}

// ==========================================
// 7. MEMBERS MANAGEMENT & CREDENTIALS (ADMIN)
// ==========================================

function handleSaveMember(event) {
  event.preventDefault();

  const id = document.getElementById('member-form-id').value;
  const name = (document.getElementById('member-input-name').value || '').trim();
  const username = (document.getElementById('member-input-username').value || '').trim();
  const password = (document.getElementById('member-input-password').value || '').trim();
  const email = (document.getElementById('member-input-email').value || '').trim();
  const phone = (document.getElementById('member-input-phone').value || '').trim();
  const tier = document.getElementById('member-input-tier').value || 'Standard';
  const status = document.getElementById('member-input-status').value || 'Active';
  const address = (document.getElementById('member-input-address').value || '').trim();

  if (!name || !username || !password) {
    showToast('Please provide Name, Login Username, and Password.', 'error');
    return;
  }

  // Safe username uniqueness check
  const cleanUsername = username.toLowerCase();
  const duplicate = members.find(m => 
    (m.username || '').toLowerCase() === cleanUsername && m.id !== id
  );

  if (duplicate || cleanUsername === 'admin') {
    showToast(`Username '${username}' is already in use. Please select a unique username.`, 'error');
    return;
  }

  if (id) {
    // Edit existing member
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = {
        ...members[index],
        name: name,
        username: username,
        password: password,
        email: email || members[index].email || `${username}@library.org`,
        phone: phone || members[index].phone || '+1 555-0100',
        tier: tier,
        status: status,
        address: address || members[index].address || ''
      };

      // If updating the active logged-in member
      if (currentUser && currentUser.role === 'member' && currentUser.id === id) {
        currentUser = { ...members[index], role: 'member' };
      }

      logActivity(`Admin updated login credentials for ${name} (User: ${username})`, 'member');
      showToast(`Member profile and login for '${name}' saved successfully!`, 'success');
    }
  } else {
    // Add new member
    const newId = `MEM-${1000 + members.length + 1}`;
    const newMember = {
      id: newId,
      name: name,
      username: username,
      password: password,
      email: email || `${username}@library.org`,
      phone: phone || '+1 555-0100',
      tier: tier,
      status: status,
      address: address || 'Library Patron',
      joinDate: new Date().toISOString().split('T')[0]
    };
    members.push(newMember);
    logActivity(`Admin enrolled new member with login: ${name} (${username})`, 'member');
    showToast(`New member '${name}' created with login username '${username}'!`, 'success');
  }

  saveData();
  closeModal('modal-add-member');
  renderMembers();
  renderDashboard();
  updateBadges();
}

function openEditMemberModal(memberId) {
  const member = members.find(m => m.id === memberId);
  if (!member) return;

  document.getElementById('modal-member-title').innerText = "Edit Member & Login Credentials";
  document.getElementById('member-form-id').value = member.id;
  document.getElementById('member-input-name').value = member.name || '';
  document.getElementById('member-input-username').value = member.username || '';
  document.getElementById('member-input-password').value = member.password || '';
  document.getElementById('member-input-email').value = member.email || '';
  document.getElementById('member-input-phone').value = member.phone || '';
  document.getElementById('member-input-tier').value = member.tier || 'Standard';
  document.getElementById('member-input-status').value = member.status || 'Active';
  document.getElementById('member-input-address').value = member.address || '';

  openModal('modal-add-member');
}

function confirmDeleteMember(memberId) {
  const member = members.find(m => m.id === memberId);
  if (!member) return;

  const activeLoans = loans.filter(l => l.memberId === memberId && !l.returnDate);
  if (activeLoans.length > 0) {
    showToast(`Cannot remove ${member.name}. They currently hold ${activeLoans.length} unreturned book(s)!`, 'error');
    return;
  }

  activeDeleteTarget = {
    type: 'member',
    id: member.id,
    name: member.name
  };

  document.getElementById('delete-confirm-title').innerText = "De-enroll Member";
  document.getElementById('delete-confirm-desc').innerText = `Are you sure you want to remove member account "${member.name}" (${member.id})? Their login will also be deleted.`;

  openModal('modal-confirm-delete');
}

function renderMembers() {
  const search = (document.getElementById('member-search-input')?.value || '').toLowerCase().trim();
  const tierFilter = document.getElementById('member-tier-filter')?.value || 'ALL';

  const filtered = members.filter(member => {
    const matchesSearch = 
      (member.name || '').toLowerCase().includes(search) ||
      (member.email || '').toLowerCase().includes(search) ||
      (member.id || '').toLowerCase().includes(search) ||
      (member.username || '').toLowerCase().includes(search);

    const matchesTier = tierFilter === 'ALL' || member.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const tableBody = document.getElementById('members-table-body');
  const emptyState = document.getElementById('members-empty-state');

  if (filtered.length === 0) {
    tableBody.parentElement.parentElement.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  tableBody.parentElement.parentElement.classList.remove('hidden');
  tableBody.innerHTML = '';

  filtered.forEach(member => {
    const activeBorrowedCount = loans.filter(l => l.memberId === member.id && !l.returnDate).length;
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/80 transition";

    const initials = (member.name || 'Member').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const isPasswordRevealed = allPasswordsRevealed || revealedPasswords.has(member.id);

    const tierBadges = {
      'Faculty': 'bg-purple-50 text-purple-700 border-purple-200',
      'Premium': 'bg-amber-50 text-amber-700 border-amber-200',
      'Student': 'bg-blue-50 text-blue-700 border-blue-200',
      'Standard': 'bg-slate-100 text-slate-700 border-slate-200'
    };

    const tierBadgeClass = tierBadges[member.tier] || 'bg-slate-100 text-slate-700';

    tr.innerHTML = `
      <td class="py-3.5 px-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs shadow-xs">
          ${initials}
        </div>
        <div>
          <p class="font-bold text-slate-900">${escapeHtml(member.name)}</p>
          <p class="text-xs text-slate-500">Joined ${escapeHtml(member.joinDate || '2024')}</p>
        </div>
      </td>
      <td class="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">${escapeHtml(member.id)}</td>
      
      <!-- Admin View & Manage Member Credentials -->
      <td class="py-3.5 px-4 bg-amber-50/40 border-x border-amber-200/50">
        <div class="space-y-1">
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-slate-400 font-medium">User:</span>
            <code class="font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">${escapeHtml(member.username || 'unassigned')}</code>
          </div>
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-slate-400 font-medium">Pass:</span>
            <span class="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs font-semibold">
              ${isPasswordRevealed ? escapeHtml(member.password) : '••••••'}
            </span>
            <button type="button" onclick="togglePasswordReveal('${member.id}')" title="${isPasswordRevealed ? 'Hide Password' : 'Show Password'}" class="text-amber-700 hover:text-amber-900 p-1">
              <i class="fa-regular ${isPasswordRevealed ? 'fa-eye-slash' : 'fa-eye'} text-xs"></i>
            </button>
            <button type="button" onclick="openEditMemberModal('${member.id}')" title="Change/Manage Password" class="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold underline ml-1">
              Edit
            </button>
          </div>
        </div>
      </td>

      <td class="py-3.5 px-4">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border ${tierBadgeClass}">
          ${escapeHtml(member.tier)}
        </span>
      </td>
      <td class="py-3.5 px-4 text-xs">
        <p class="text-slate-800 font-medium">${escapeHtml(member.email)}</p>
        <p class="text-slate-500">${escapeHtml(member.phone)}</p>
      </td>
      <td class="py-3.5 px-4">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}">
          ${escapeHtml(member.status)}
        </span>
      </td>
      <td class="py-3.5 px-4">
        <span class="text-xs font-bold px-2 py-0.5 rounded-md ${activeBorrowedCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}">
          ${activeBorrowedCount} books
        </span>
      </td>
      <td class="py-3.5 px-4 text-right space-x-1">
        <button onclick="openEditMemberModal('${member.id}')" title="Edit Profile & Password" class="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition">
          <i class="fa-solid fa-user-pen"></i>
        </button>
        <button onclick="confirmDeleteMember('${member.id}')" title="Remove Member" class="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function filterMembers() {
  renderMembers();
}

function togglePasswordReveal(memberId) {
  if (revealedPasswords.has(memberId)) {
    revealedPasswords.delete(memberId);
  } else {
    revealedPasswords.add(memberId);
  }
  renderMembers();
}

function toggleAllPasswordsReveal() {
  allPasswordsRevealed = !allPasswordsRevealed;
  const btnText = document.getElementById('btn-reveal-all-text');
  if (btnText) {
    btnText.innerText = allPasswordsRevealed ? "Hide All" : "Show All";
  }
  renderMembers();
}

// ==========================================
// 8. CIRCULATION & BORROWING
// ==========================================

function openIssueBookModal() {
  const bookSelect = document.getElementById('issue-select-book');
  const memberSelect = document.getElementById('issue-select-member');

  bookSelect.innerHTML = '';
  const availableBooks = books.filter(b => b.available > 0);
  if (availableBooks.length === 0) {
    bookSelect.innerHTML = '<option value="">No books currently available</option>';
  } else {
    availableBooks.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.innerText = `${b.title} (${b.available} left) - ${b.author}`;
      bookSelect.appendChild(opt);
    });
  }

  memberSelect.innerHTML = '';
  const activeMembers = members.filter(m => m.status === 'Active');
  if (activeMembers.length === 0) {
    memberSelect.innerHTML = '<option value="">No active members found</option>';
  } else {
    activeMembers.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.innerText = `${m.name} (${m.id}) - User: ${m.username}`;
      memberSelect.appendChild(opt);
    });
  }

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);

  document.getElementById('issue-date').value = today.toISOString().split('T')[0];
  document.getElementById('issue-due-date').value = dueDate.toISOString().split('T')[0];

  openModal('modal-issue-book');
}

function handleIssueBook(event) {
  event.preventDefault();

  const bookId = document.getElementById('issue-select-book').value;
  const memberId = document.getElementById('issue-select-member').value;
  const borrowDate = document.getElementById('issue-date').value;
  const dueDate = document.getElementById('issue-due-date').value;

  if (!bookId || !memberId) {
    showToast('Please select both a valid book and a member.', 'error');
    return;
  }

  const book = books.find(b => b.id === bookId);
  const member = members.find(m => m.id === memberId);

  if (!book || book.available <= 0) {
    showToast('Selected volume is currently unavailable.', 'error');
    return;
  }

  const memberActiveLoans = loans.filter(l => l.memberId === memberId && !l.returnDate).length;
  const tierLimits = { 'Student': 3, 'Standard': 5, 'Premium': 10, 'Faculty': 15 };
  const maxAllowed = tierLimits[member.tier] || 5;

  if (memberActiveLoans >= maxAllowed) {
    showToast(`Borrowing quota reached! ${member.tier} tier allows max ${maxAllowed} books at a time.`, 'error');
    return;
  }

  const newLoan = {
    id: `LN-${5000 + loans.length + 1}`,
    bookId: book.id,
    memberId: member.id,
    borrowDate: borrowDate,
    dueDate: dueDate,
    returnDate: null,
    status: "Active"
  };

  book.available -= 1;
  loans.unshift(newLoan);

  logActivity(`Issued '${book.title}' to member ${member.name}`, 'loan');
  showToast(`Book '${book.title}' successfully issued to ${member.name}! Due on ${dueDate}.`, 'success');

  saveData();
  closeModal('modal-issue-book');
  renderBooks();
  renderCirculation();
  renderDashboard();
  updateBadges();
}

function quickMemberBorrow(bookId) {
  if (!currentUser || currentUser.role !== 'member') {
    showToast('Please sign in as a member to borrow books.', 'error');
    return;
  }

  const book = books.find(b => b.id === bookId);
  if (!book || book.available <= 0) {
    showToast('Sorry, this volume is currently out of stock.', 'error');
    return;
  }

  const myActiveLoans = loans.filter(l => l.memberId === currentUser.id && !l.returnDate);
  const tierLimits = { 'Student': 3, 'Standard': 5, 'Premium': 10, 'Faculty': 15 };
  const maxAllowed = tierLimits[currentUser.tier] || 5;

  if (myActiveLoans.length >= maxAllowed) {
    showToast(`You have reached your borrowing limit of ${maxAllowed} books for the ${currentUser.tier} tier.`, 'error');
    return;
  }

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);

  const newLoan = {
    id: `LN-${5000 + loans.length + 1}`,
    bookId: book.id,
    memberId: currentUser.id,
    borrowDate: today.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    returnDate: null,
    status: "Active"
  };

  book.available -= 1;
  loans.unshift(newLoan);

  logActivity(`${currentUser.name} borrowed '${book.title}'`, 'loan');
  showToast(`Success! '${book.title}' has been issued to you. Due on ${dueDate.toISOString().split('T')[0]}.`, 'success');

  saveData();
  renderBooks();
  renderCirculation();
  renderDashboard();
  updateBadges();
}

function handleReturnBook(loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan || loan.returnDate) return;

  const book = books.find(b => b.id === loan.bookId);
  const member = members.find(m => m.id === loan.memberId);

  loan.returnDate = new Date().toISOString().split('T')[0];
  loan.status = "Returned";

  if (book) {
    book.available = Math.min(book.copies, book.available + 1);
  }

  logActivity(`Returned volume: '${book ? book.title : 'Book'}' by ${member ? member.name : 'Patron'}`, 'loan');
  showToast(`Book successfully returned to inventory!`, 'success');

  saveData();
  renderBooks();
  renderCirculation();
  renderDashboard();
  updateBadges();
}

function renderCirculation() {
  const tableBody = document.getElementById('loans-table-body');
  const emptyState = document.getElementById('loans-empty-state');
  const isAdmin = currentUser && currentUser.role === 'admin';

  const relevantLoans = isAdmin
    ? loans
    : loans.filter(l => l.memberId === currentUser.id);

  if (relevantLoans.length === 0) {
    tableBody.parentElement.parentElement.classList.add('hidden');
    emptyState.classList.remove('hidden');
    document.getElementById('loans-empty-title').innerText = isAdmin 
      ? "No outstanding book loans" 
      : "You have no active book loans";
    return;
  }

  emptyState.classList.add('hidden');
  tableBody.parentElement.parentElement.classList.remove('hidden');
  tableBody.innerHTML = '';

  relevantLoans.forEach(loan => {
    const book = books.find(b => b.id === loan.bookId) || { title: 'Unknown Book', isbn: 'N/A' };
    const member = members.find(m => m.id === loan.memberId) || { name: 'Unknown Patron', email: 'N/A' };

    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/80 transition";

    const isReturned = !!loan.returnDate;
    const isOverdue = !isReturned && new Date(loan.dueDate) < new Date();

    let statusHtml = '';
    if (isReturned) {
      statusHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"><i class="fa-solid fa-check mr-1"></i> Returned</span>`;
    } else if (isOverdue) {
      statusHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Overdue</span>`;
    } else {
      statusHtml = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700"><i class="fa-regular fa-clock mr-1"></i> In Circulation</span>`;
    }

    tr.innerHTML = `
      <td class="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">${loan.id}</td>
      <td class="py-3.5 px-4">
        <p class="font-bold text-slate-900">${escapeHtml(book.title)}</p>
        <p class="text-xs text-slate-400">ID: ${loan.bookId}</p>
      </td>
      <td class="py-3.5 px-4">
        <p class="font-semibold text-slate-800">${escapeHtml(member.name)}</p>
        <p class="text-xs text-slate-500">${escapeHtml(member.email)}</p>
      </td>
      <td class="py-3.5 px-4 text-xs text-slate-600">${loan.borrowDate}</td>
      <td class="py-3.5 px-4 text-xs font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}">${loan.dueDate}</td>
      <td class="py-3.5 px-4">${statusHtml}</td>
      <td class="py-3.5 px-4 text-right">
        ${!isReturned ? `
          <button onclick="handleReturnBook('${loan.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition">
            <i class="fa-solid fa-rotate-left mr-1"></i> Return Book
          </button>
        ` : `
          <span class="text-xs text-slate-400 italic">Returned on ${loan.returnDate}</span>
        `}
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ==========================================
// 9. EXECUTE DELETION & PROFILE
// ==========================================

function executeDeletion() {
  if (!activeDeleteTarget) return;

  const { type, id, name } = activeDeleteTarget;

  if (type === 'book') {
    books = books.filter(b => b.id !== id);
    logActivity(`Removed volume '${name}' (${id}) from catalog`, 'book');
    showToast(`Book '${name}' deleted successfully.`, 'info');
  } else if (type === 'member') {
    members = members.filter(m => m.id !== id);
    logActivity(`Removed member '${name}' (${id}) from library registry`, 'member');
    showToast(`Member account '${name}' removed.`, 'info');
  }

  saveData();
  closeModal('modal-confirm-delete');
  activeDeleteTarget = null;
  populateCategoryFilter();
  renderBooks();
  renderMembers();
  renderDashboard();
  updateBadges();
}

function renderLibraryProfile() {
  document.getElementById('info-name').innerText = libraryProfile.name;
  document.getElementById('info-librarian').innerText = libraryProfile.librarian;
  document.getElementById('info-hours').innerText = libraryProfile.hours;
  document.getElementById('info-address').innerText = libraryProfile.address;
  document.getElementById('info-phone').innerText = libraryProfile.phone;
  document.getElementById('info-email').innerText = libraryProfile.email;

  document.getElementById('sidebar-lib-name').innerText = libraryProfile.name.split(' ')[0] + " Library";
  document.getElementById('dash-lib-tagline').innerText = libraryProfile.tagline;
  document.getElementById('dash-hours').innerText = libraryProfile.hours;
  document.getElementById('dash-phone').innerText = libraryProfile.phone;
}

function openEditLibraryModal() {
  document.getElementById('lib-edit-name').value = libraryProfile.name;
  document.getElementById('lib-edit-librarian').value = libraryProfile.librarian;
  document.getElementById('lib-edit-hours').value = libraryProfile.hours;
  document.getElementById('lib-edit-address').value = libraryProfile.address;
  document.getElementById('lib-edit-phone').value = libraryProfile.phone;
  document.getElementById('lib-edit-email').value = libraryProfile.email;

  openModal('modal-edit-library');
}

function handleSaveLibraryProfile(event) {
  event.preventDefault();

  libraryProfile.name = document.getElementById('lib-edit-name').value.trim();
  libraryProfile.librarian = document.getElementById('lib-edit-librarian').value.trim();
  libraryProfile.hours = document.getElementById('lib-edit-hours').value.trim();
  libraryProfile.address = document.getElementById('lib-edit-address').value.trim();
  libraryProfile.phone = document.getElementById('lib-edit-phone').value.trim();
  libraryProfile.email = document.getElementById('lib-edit-email').value.trim();

  saveData();
  closeModal('modal-edit-library');
  renderLibraryProfile();
  logActivity('Updated Library Institutional Profile', 'system');
  showToast('Library details updated successfully!', 'success');
}

function exportData() {
  const exportPayload = {
    app: "Alexandria Library Management System",
    version: "2.5",
    exportedAt: new Date().toISOString(),
    profile: libraryProfile,
    books: books,
    members: members,
    loans: loans,
    logs: logs
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `alexandria_library_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Library database backup exported as JSON!', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.books && Array.isArray(data.books)) {
        books = data.books;
        if (data.members) members = sanitizeMembersList(data.members);
        if (data.loans) loans = data.loans;
        if (data.profile) libraryProfile = data.profile;
        if (data.logs) logs = data.logs;

        saveData();
        renderBooks();
        renderMembers();
        renderCirculation();
        renderDashboard();
        renderLibraryProfile();
        populateCategoryFilter();
        updateBadges();
        showToast('Library database restored successfully from JSON file!', 'success');
      } else {
        showToast('Invalid backup file structure.', 'error');
      }
    } catch (err) {
      showToast('Error reading backup file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function resetToSampleData() {
  if (confirm("Reset library to original demo catalog and member accounts?")) {
    books = [...DEFAULT_BOOKS];
    members = [...DEFAULT_MEMBERS];
    loans = [...DEFAULT_LOANS];
    logs = [...DEFAULT_LOGS];
    libraryProfile = { ...DEFAULT_PROFILE };

    saveData();
    renderBooks();
    renderMembers();
    renderCirculation();
    renderDashboard();
    renderLibraryProfile();
    populateCategoryFilter();
    updateBadges();
    showToast('Library restored to default records.', 'info');
  }
}

// ==========================================
// 10. MODAL & UTILITY FUNCTIONS
// ==========================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (modalId === 'modal-add-book' && !document.getElementById('book-form-id').value) {
    document.getElementById('modal-book-title').innerText = "Catalog New Book";
    document.getElementById('form-book').reset();
    document.getElementById('book-form-id').value = '';
    removeBookImage();
  }

  if (modalId === 'modal-add-member' && !document.getElementById('member-form-id').value) {
    document.getElementById('modal-member-title').innerText = "Enroll Library Member";
    document.getElementById('form-member').reset();
    document.getElementById('member-form-id').value = '';
  }

  if (modalId === 'modal-issue-book') {
    openIssueBookModal();
  }

  if (modalId === 'modal-edit-library') {
    document.getElementById('lib-edit-name').value = libraryProfile.name || '';
    document.getElementById('lib-edit-librarian').value = libraryProfile.librarian || '';
    document.getElementById('lib-edit-hours').value = libraryProfile.hours || '';
    document.getElementById('lib-edit-address').value = libraryProfile.address || '';
    document.getElementById('lib-edit-phone').value = libraryProfile.phone || '';
    document.getElementById('lib-edit-email').value = libraryProfile.email || '';
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';

  if (modalId === 'modal-add-book') {
    document.getElementById('book-form-id').value = '';
    removeBookImage();
  }
  if (modalId === 'modal-add-member') {
    document.getElementById('member-form-id').value = '';
  }
}

function setupEventListeners() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  const deleteBtn = document.getElementById('btn-execute-delete');
  if (deleteBtn) {
    deleteBtn.onclick = executeDeletion;
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-slate-900 text-white'
  };

  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-bell'
  };

  toast.className = `toast-item px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    <i class="${icons[type] || icons.info} text-sm"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.addEventListener('DOMContentLoaded', initSystem);
