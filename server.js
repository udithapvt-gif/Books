/**
 * Alexandria Library Management System - Live Central Database & API Server
 * Built with pure Node.js (Zero external npm dependencies required!)
 * Allows any device (PC, laptop, smartphone, tablet) on your network or internet
 * to log in, view live books, borrow, manage members, and keep data synchronized in real-time.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'library_database.json');

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Default initial database content
const INITIAL_DATABASE = {
  version: "2.5",
  lastUpdated: new Date().toISOString(),
  profile: {
    name: "Alexandria Athenaeum Central Library",
    tagline: "Preserving human knowledge and fostering discovery since 1924.",
    librarian: "Dr. Eleanor Vance, Ph.D. in Library Sciences",
    hours: "Mon - Sat: 8:00 AM – 9:00 PM | Sun: 10:00 AM – 6:00 PM",
    address: "450 University Boulevard, Academic Quarter, Suite 101",
    phone: "+1 (555) 234-8900",
    email: "curator@alexandrialibrary.org"
  },
  admin: {
    username: "admin",
    password: "123",
    role: "admin",
    name: "Dr. Eleanor Vance (Admin)",
    email: "admin@alexandrialibrary.org"
  },
  books: [
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
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
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
      description: "A portrait of the Jazz Age exploring idealism, social upheaval, and the elusive American Dream.",
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
      description: "From the big bang to black holes, Stephen Hawking explores the most profound questions about our universe.",
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
      description: "How did an insignificant ape become the ruler of planet Earth? Harari recounts human civilizational history.",
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
      description: "Plato's seminal dialogue examining justice, the ideal society, and the allegory of the cave.",
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
      description: "The foundational Gang of Four classic cataloging 23 software design patterns.",
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
    }
  ],
  members: [
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
  ],
  loans: [
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
  ],
  logs: [
    { text: "Central Database Server started with live synchronization", time: "Just now", type: "system" }
  ]
};

// ==========================================
// DATABASE PERSISTENCE HELPERS
// ==========================================

function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
    console.log('[Database] Created new library database at:', DB_FILE);
  }
}

function readDatabase() {
  ensureDatabase();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Database Read Error]', err);
    return INITIAL_DATABASE;
  }
}

function writeDatabase(data) {
  ensureDatabase();
  data.lastUpdated = new Date().toISOString();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Database Write Error]', err);
    return false;
  }
}

// ==========================================
// NETWORK UTILITIES
// ==========================================

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
}

// ==========================================
// HTTP REQUEST & BODY PARSER
// ==========================================

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Guard against huge payload
      if (body.length > 25 * 1024 * 1024) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

// ==========================================
// HTTP SERVER ROUTER
// ==========================================

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // API ROUTES
  if (pathname.startsWith('/api/')) {
    const db = readDatabase();

    // 1. SYSTEM STATUS & LIVE SYNC
    if (pathname === '/api/status' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        database: 'connected',
        lastUpdated: db.lastUpdated,
        localIps: getLocalIpAddresses(),
        port: PORT
      });
    }

    // 2. GET FULL STATE (For cross-device hydration)
    if (pathname === '/api/sync' && method === 'GET') {
      return sendJson(res, 200, {
        lastUpdated: db.lastUpdated,
        profile: db.profile,
        books: db.books,
        members: db.members,
        loans: db.loans,
        logs: db.logs
      });
    }

    // 3. AUTHENTICATION: LOGIN
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { username, password } = await parseRequestBody(req);
      const cleanUser = (username || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      // Check Admin
      if (cleanUser === db.admin.username && cleanPass === db.admin.password) {
        return sendJson(res, 200, {
          success: true,
          user: {
            role: 'admin',
            username: db.admin.username,
            name: db.admin.name,
            email: db.admin.email
          }
        });
      }

      // Check Member
      const member = db.members.find(m => 
        (m.username || '').toLowerCase() === cleanUser && 
        (m.password || '') === cleanPass
      );

      if (member) {
        if (member.status === 'Suspended') {
          return sendJson(res, 403, { success: false, message: 'Account is suspended.' });
        }
        return sendJson(res, 200, {
          success: true,
          user: { ...member, role: 'member' }
        });
      }

      return sendJson(res, 401, { success: false, message: 'Invalid username or password.' });
    }

    // 4. AUTHENTICATION: MEMBER SIGN UP (SELF-REGISTRATION)
    if (pathname === '/api/auth/register' && method === 'POST') {
      const data = await parseRequestBody(req);
      const cleanUser = (data.username || '').trim().toLowerCase();
      const cleanPass = (data.password || '').trim();
      const cleanName = (data.name || '').trim();

      if (!cleanName || !cleanUser || !cleanPass) {
        return sendJson(res, 400, { success: false, message: 'Name, username, and password required.' });
      }

      if (cleanUser === 'admin' || db.members.some(m => (m.username || '').toLowerCase() === cleanUser)) {
        return sendJson(res, 409, { success: false, message: `Username '${data.username}' is already taken.` });
      }

      const newMember = {
        id: `MEM-${1000 + db.members.length + 1}`,
        name: cleanName,
        username: data.username.trim(),
        password: cleanPass,
        email: data.email?.trim() || `${data.username}@library.org`,
        phone: data.phone?.trim() || '+1 555-0199',
        tier: data.tier || 'Standard',
        status: 'Active',
        address: data.address?.trim() || 'Online Member',
        joinDate: new Date().toISOString().split('T')[0]
      };

      db.members.push(newMember);
      db.logs.unshift({
        text: `New member registered: ${cleanName} (${data.username})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'member'
      });

      writeDatabase(db);
      return sendJson(res, 201, {
        success: true,
        user: { ...newMember, role: 'member' }
      });
    }

    // 5. BOOKS CRUD
    if (pathname === '/api/books' && method === 'GET') {
      return sendJson(res, 200, db.books);
    }

    if (pathname === '/api/books' && method === 'POST') {
      const bookData = await parseRequestBody(req);
      const newBook = {
        id: `BK-${1000 + db.books.length + 1}`,
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        category: bookData.category.trim(),
        isbn: bookData.isbn || '',
        year: parseInt(bookData.year) || null,
        copies: parseInt(bookData.copies) || 1,
        available: parseInt(bookData.copies) || 1,
        location: bookData.location || '',
        publisher: bookData.publisher || '',
        description: bookData.description || '',
        coverImage: bookData.coverImage || ''
      };

      db.books.push(newBook);
      db.logs.unshift({
        text: `Cataloged new volume: '${newBook.title}'`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'book'
      });

      writeDatabase(db);
      return sendJson(res, 201, newBook);
    }

    if (pathname.startsWith('/api/books/') && method === 'PUT') {
      const id = pathname.split('/')[3];
      const updates = await parseRequestBody(req);
      const index = db.books.findIndex(b => b.id === id);

      if (index === -1) {
        return sendJson(res, 404, { success: false, message: 'Book not found' });
      }

      const existing = db.books[index];
      const diff = (parseInt(updates.copies) || existing.copies) - existing.copies;
      const newAvailable = Math.max(0, existing.available + diff);

      db.books[index] = {
        ...existing,
        ...updates,
        available: newAvailable
      };

      db.logs.unshift({
        text: `Updated volume: '${updates.title || existing.title}'`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'book'
      });

      writeDatabase(db);
      return sendJson(res, 200, db.books[index]);
    }

    if (pathname.startsWith('/api/books/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      const hasActiveLoans = db.loans.some(l => l.bookId === id && !l.returnDate);
      if (hasActiveLoans) {
        return sendJson(res, 400, { success: false, message: 'Cannot delete: copies are currently borrowed.' });
      }

      const target = db.books.find(b => b.id === id);
      db.books = db.books.filter(b => b.id !== id);

      db.logs.unshift({
        text: `Deleted book: '${target ? target.title : id}'`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'book'
      });

      writeDatabase(db);
      return sendJson(res, 200, { success: true });
    }

    // 6. MEMBERS CRUD (ADMIN VIEW & MANAGE)
    if (pathname === '/api/members' && method === 'GET') {
      return sendJson(res, 200, db.members);
    }

    if (pathname === '/api/members' && method === 'POST') {
      const memberData = await parseRequestBody(req);
      const cleanUser = (memberData.username || '').trim().toLowerCase();

      if (cleanUser === 'admin' || db.members.some(m => (m.username || '').toLowerCase() === cleanUser)) {
        return sendJson(res, 409, { success: false, message: `Username '${memberData.username}' is taken.` });
      }

      const newMember = {
        id: `MEM-${1000 + db.members.length + 1}`,
        name: memberData.name.trim(),
        username: memberData.username.trim(),
        password: memberData.password.trim(),
        email: memberData.email?.trim() || `${memberData.username}@library.org`,
        phone: memberData.phone?.trim() || '+1 555-0100',
        tier: memberData.tier || 'Standard',
        status: memberData.status || 'Active',
        address: memberData.address?.trim() || 'Patron Address',
        joinDate: new Date().toISOString().split('T')[0]
      };

      db.members.push(newMember);
      db.logs.unshift({
        text: `Admin enrolled member: ${newMember.name} (User: ${newMember.username})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'member'
      });

      writeDatabase(db);
      return sendJson(res, 201, newMember);
    }

    if (pathname.startsWith('/api/members/') && method === 'PUT') {
      const id = pathname.split('/')[3];
      const updates = await parseRequestBody(req);
      const index = db.members.findIndex(m => m.id === id);

      if (index === -1) {
        return sendJson(res, 404, { success: false, message: 'Member not found' });
      }

      // Check username collision
      if (updates.username) {
        const cleanUser = updates.username.trim().toLowerCase();
        const duplicate = db.members.find(m => (m.username || '').toLowerCase() === cleanUser && m.id !== id);
        if (duplicate || cleanUser === 'admin') {
          return sendJson(res, 409, { success: false, message: `Username '${updates.username}' is taken.` });
        }
      }

      db.members[index] = {
        ...db.members[index],
        ...updates
      };

      db.logs.unshift({
        text: `Admin updated member: ${db.members[index].name} (User: ${db.members[index].username})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'member'
      });

      writeDatabase(db);
      return sendJson(res, 200, db.members[index]);
    }

    if (pathname.startsWith('/api/members/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      const hasActiveLoans = db.loans.some(l => l.memberId === id && !l.returnDate);
      if (hasActiveLoans) {
        return sendJson(res, 400, { success: false, message: 'Cannot delete: patron has unreturned books.' });
      }

      const target = db.members.find(m => m.id === id);
      db.members = db.members.filter(m => m.id !== id);

      db.logs.unshift({
        text: `Removed member account: ${target ? target.name : id}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'member'
      });

      writeDatabase(db);
      return sendJson(res, 200, { success: true });
    }

    // 7. LOANS / CIRCULATION
    if (pathname === '/api/loans' && method === 'GET') {
      return sendJson(res, 200, db.loans);
    }

    if (pathname === '/api/loans' && method === 'POST') {
      const loanData = await parseRequestBody(req);
      const book = db.books.find(b => b.id === loanData.bookId);
      const member = db.members.find(m => m.id === loanData.memberId);

      if (!book || book.available <= 0) {
        return sendJson(res, 400, { success: false, message: 'Book is currently unavailable.' });
      }

      if (!member) {
        return sendJson(res, 400, { success: false, message: 'Member not found.' });
      }

      const newLoan = {
        id: `LN-${5000 + db.loans.length + 1}`,
        bookId: book.id,
        memberId: member.id,
        borrowDate: loanData.borrowDate || new Date().toISOString().split('T')[0],
        dueDate: loanData.dueDate,
        returnDate: null,
        status: 'Active'
      };

      book.available -= 1;
      db.loans.unshift(newLoan);

      db.logs.unshift({
        text: `${member.name} checked out '${book.title}'`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'loan'
      });

      writeDatabase(db);
      return sendJson(res, 201, newLoan);
    }

    if (pathname.startsWith('/api/loans/') && pathname.endsWith('/return') && method === 'POST') {
      const loanId = pathname.split('/')[3];
      const loan = db.loans.find(l => l.id === loanId);

      if (!loan || loan.returnDate) {
        return sendJson(res, 400, { success: false, message: 'Loan is already returned or not found.' });
      }

      const book = db.books.find(b => b.id === loan.bookId);
      const member = db.members.find(m => m.id === loan.memberId);

      loan.returnDate = new Date().toISOString().split('T')[0];
      loan.status = 'Returned';

      if (book) {
        book.available = Math.min(book.copies, book.available + 1);
      }

      db.logs.unshift({
        text: `Returned: '${book ? book.title : 'Book'}' by ${member ? member.name : 'Patron'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'loan'
      });

      writeDatabase(db);
      return sendJson(res, 200, loan);
    }

    // 8. PROFILE & RESET
    if (pathname === '/api/profile' && method === 'PUT') {
      const profileUpdates = await parseRequestBody(req);
      db.profile = { ...db.profile, ...profileUpdates };
      writeDatabase(db);
      return sendJson(res, 200, db.profile);
    }

    if (pathname === '/api/reset' && method === 'POST') {
      writeDatabase(INITIAL_DATABASE);
      return sendJson(res, 200, { success: true, message: 'Database reset to default records.' });
    }

    return sendJson(res, 404, { success: false, message: 'API route not found' });
  }

  // STATIC FILE SERVING
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

// START THE SERVER
ensureDatabase();
server.listen(PORT, '0.0.0.0', () => {
  const localIps = getLocalIpAddresses();
  console.log('\n======================================================');
  console.log('🏛️  ALEXANDRIA LIVE DATABASE SERVER ONLINE!');
  console.log('======================================================');
  console.log(`💻 On this computer:          http://localhost:${PORT}`);
  if (localIps.length > 0) {
    console.log(`📱 Any Phone/Tablet/Device:   http://${localIps[0]}:${PORT}`);
  }
  console.log('🗄️  Persistent Database:      ', DB_FILE);
  console.log('======================================================\n');
});
