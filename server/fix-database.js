const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Fixing user_activity table...\n');

// Drop the old incorrect table
db.run('DROP TABLE IF EXISTS user_activity', (err) => {
    if (err) {
        console.error('❌ Error dropping table:', err.message);
        db.close();
        return;
    }
    
    console.log('🗑️  Dropped old user_activity table\n');
    
    // Create new table with correct structure
    db.run(`CREATE TABLE user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_type TEXT NOT NULL,
        gk_id INTEGER,
        is_correct INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(gk_id) REFERENCES gk_points(id)
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating table:', err.message);
            db.close();
            return;
        }
        
        console.log('✅ Created new user_activity table with correct structure!\n');
        
        // Verify structure
        db.get("SELECT sql FROM sqlite_master WHERE name='user_activity'", (err, row) => {
            if (row) {
                console.log('📋 Table Structure:');
                console.log(row.sql);
                console.log('\n✅ Database fixed! Restart your server now.');
            }
            db.close();
        });
    });
});