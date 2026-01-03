const { Pool } = require('pg');

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
    console.error('❌ CRITICAL ERROR: DATABASE_URL environment variable is not set!');
    console.error('Please add DATABASE_URL to your Render environment variables.');
    console.error('Example: postgresql://postgres:password@host:5432/database');
    process.exit(1);
}

// Use DATABASE_URL from environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        console.error('Make sure your DATABASE_URL is correct.');
        process.exit(1);
    } else {
        console.log('✅ Connected to PostgreSQL database at:', new Date(res.rows[0].now).toLocaleString());
    }
});

// Initialize tables
const initializeTables = async () => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                exam_type TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table ready');

        // News Cache table
        await client.query(`
            CREATE TABLE IF NOT EXISTS news_cache (
                id SERIAL PRIMARY KEY,
                query_key TEXT UNIQUE NOT NULL,
                data TEXT NOT NULL,
                fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ News cache table ready');

        // News Archive table
        await client.query(`
            CREATE TABLE IF NOT EXISTS news_archive (
                id SERIAL PRIMARY KEY,
                title TEXT,
                description TEXT,
                url TEXT,
                image_url TEXT,
                source_name TEXT,
                published_at TIMESTAMP,
                category TEXT,
                fetched_date DATE DEFAULT CURRENT_DATE
            )
        `);
        console.log('✅ News archive table ready');

        // GK Points table
        await client.query(`
            CREATE TABLE IF NOT EXISTS gk_points (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                category TEXT,
                priority TEXT CHECK(priority IN ('High', 'Medium', 'Low')),
                date DATE DEFAULT CURRENT_DATE,
                source_url TEXT
            )
        `);
        console.log('✅ GK points table ready');

        // Bookmarks table
        await client.query(`
            CREATE TABLE IF NOT EXISTS bookmarks (
                user_id INTEGER,
                gk_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, gk_id),
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(gk_id) REFERENCES gk_points(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Bookmarks table ready');

        // Revisions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS revisions (
                user_id INTEGER,
                gk_id INTEGER,
                reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(gk_id) REFERENCES gk_points(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Revisions table ready');

        // User Activity table
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_activity (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                activity_type TEXT NOT NULL,
                gk_id INTEGER,
                is_correct INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(gk_id) REFERENCES gk_points(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ User activity table ready');

        // Password Resets table
        await client.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                token TEXT NOT NULL UNIQUE,
                expires_at TIMESTAMP NOT NULL,
                used INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Password resets table ready');

        await client.query('COMMIT');
        console.log('✅ All database tables initialized');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error initializing tables:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Initialize tables on startup
initializeTables().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Export wrapper functions that match SQLite API
module.exports = {
    // Run query (INSERT, UPDATE, DELETE)
    run: (sql, params = [], callback) => {
        pool.query(sql, params, (err, result) => {
            if (callback) {
                if (err) {
                    callback(err);
                } else {
                    // Mimic SQLite's this.lastID and this.changes
                    const context = {
                        lastID: result.rows && result.rows.length > 0 ? result.rows[0].id : null,
                        changes: result.rowCount || 0
                    };
                    callback.call(context, null);
                }
            }
        });
    },

    // Get single row (SELECT)
    get: (sql, params = [], callback) => {
        pool.query(sql, params, (err, result) => {
            if (callback) {
                callback(err, result?.rows[0] || null);
            }
        });
    },

    // Get all rows (SELECT)
    all: (sql, params = [], callback) => {
        pool.query(sql, params, (err, result) => {
            if (callback) {
                callback(err, result?.rows || []);
            }
        });
    },

    // For direct pool access if needed
    pool
};