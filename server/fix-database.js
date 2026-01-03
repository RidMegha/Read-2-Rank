const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

console.log('🔧 Fixing user_activity table...\n');

async function fixDatabase() {
    const client = await pool.connect();
    
    try {
        // Drop the old incorrect table
        await client.query('DROP TABLE IF EXISTS user_activity CASCADE');
        console.log('🗑️  Dropped old user_activity table\n');
        
        // Create new table with correct structure
        await client.query(`
            CREATE TABLE user_activity (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                activity_type TEXT NOT NULL,
                gk_id INTEGER,
                is_correct INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(gk_id) REFERENCES gk_points(id)
            )
        `);
        console.log('✅ Created new user_activity table with correct structure!\n');
        
        // Verify structure
        const result = await client.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'user_activity'
            ORDER BY ordinal_position
        `);
        
        console.log('📋 Table Structure:');
        result.rows.forEach(row => {
            console.log(`  ${row.column_name}: ${row.data_type} ${row.column_default ? `(default: ${row.column_default})` : ''}`);
        });
        console.log('\n✅ Database fixed! Restart your server now.');
        
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

fixDatabase();


 