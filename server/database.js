const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
// const db = new sqlite3.Database(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    } else {
        console.log('✅ Connected to SQLite database at:', dbPath);
    }
});

db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        exam_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('❌ Error creating users table:', err);
        else console.log('✅ Users table ready');
    });

    // News Cache table (to store API responses and avoid hitting rate limits)
    db.run(`CREATE TABLE IF NOT EXISTS news_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_key TEXT UNIQUE NOT NULL, -- e.g., "top-headlines-in", "search-international"
        data TEXT NOT NULL, -- JSON string
        fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // News Archive table (to store individual articles for 30 days)
    db.run(`CREATE TABLE IF NOT EXISTS news_archive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        url TEXT,
        image_url TEXT,
        source_name TEXT,
        published_at DATETIME,
        category TEXT, -- 'Indian' or 'Global' or specific category
        fetched_date DATE DEFAULT (date('now'))
    )`);

    // GK Points table
    db.run(`CREATE TABLE IF NOT EXISTS gk_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        category TEXT,
        priority TEXT CHECK(priority IN ('High', 'Medium', 'Low')),
        date DATE DEFAULT (date('now')),
        source_url TEXT
    )`);

    // Bookmarks table
    db.run(`CREATE TABLE IF NOT EXISTS bookmarks (
        user_id INTEGER,
        gk_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, gk_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(gk_id) REFERENCES gk_points(id)
    )`);
    
    // Revision/History (optional but good for "Revisions Completed")
    db.run(`CREATE TABLE IF NOT EXISTS revisions (
        user_id INTEGER,
        gk_id INTEGER,
        reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(gk_id) REFERENCES gk_points(id)
    )`);
    // ================= USER ACTIVITY TABLE (DASHBOARD CORE) =================
db.run(`CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL, -- 'gk_view', 'bookmark', 'revision', 'quiz'
    gk_id INTEGER,
    is_correct INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(gk_id) REFERENCES gk_points(id)
)`);

// Add to your database.js file after the other CREATE TABLE statements

db.run(`
    CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error('Error creating password_resets table:', err);
    } else {
        console.log('✅ Password resets table ready');
    }
});

});

module.exports = db;
