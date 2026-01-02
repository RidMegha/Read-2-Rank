const express = require('express');
const cors = require('cors');
// const cron = require('node-cron');
const axios = require('axios');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');


require('dotenv').config();


const nodemailer = require('nodemailer');
// ✅ Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Gmail SMTP configuration error:', error);
    } else {
        console.log('✅ Gmail SMTP is ready to send emails');
    }
});

// ✅ IMPORT MOCK DATA FROM SEPARATE FILES
const { mockYearlyData, mockMonthlyData, getMockDailyDataDecember2025 } = require('./data');

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server & tools like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// 🔧 Quick Fix: Add this to server/server.js
// Place it AFTER middleware setup and BEFORE API routes

// ============================================
// HEALTH CHECK ENDPOINT (Add this section)
// ============================================

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected' // Since you're using SQLite
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Read-2-Rank API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      news: '/api/news/*',
      admin: '/api/admin/*'
    }
  });
});



const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined');
    process.exit(1);
}
const SECRET_KEY = process.env.JWT_SECRET;

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
if (!GNEWS_API_KEY) {
    console.warn('⚠️ GNEWS_API_KEY is not defined - news fetching will fail');
}

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️ Gmail credentials not set - password reset emails will fail');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Helper Functions ---

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '30d' });
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    jwt.verify(parts[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        next();
    });
};

// --- Authentication & User Routes ---

app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, exam_type } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run('INSERT INTO users (name, email, password, exam_type) VALUES (?, ?, ?, ?)', 
        [name, email, hashedPassword, exam_type], 
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                return res.status(500).json({ message: 'Database error' });
            }
            const token = generateToken({ id: this.lastID, email });
            return res.status(201).json({ token, user: { id: this.lastID, name, email, exam_type } });
        }
    );
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' });

        const token = generateToken(user);
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, exam_type: user.exam_type } });
    });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
    db.get('SELECT id, name, email, exam_type, created_at FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user);
    });
});

app.put('/api/auth/profile', verifyToken, (req, res) => {
    const { name, exam_type } = req.body;
    db.run('UPDATE users SET name = ?, exam_type = ? WHERE id = ?', [name, exam_type, req.userId], function(err) {
        if (err) return res.status(500).json({ message: 'Database error' });
        db.get('SELECT id, name, email, exam_type FROM users WHERE id = ?', [req.userId], (err, user) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            return res.json(user);
        });
    });
});

app.put('/api/auth/password', verifyToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    db.get('SELECT password FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid current password' });
        
        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId], (err) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            return res.json({ message: 'Password updated successfully' });
        });
    });
});

// =====================================================
// ✅ PASSWORD RESET ROUTES (ADD THESE)
// =====================================================

// 1. Request password reset (send reset email)
// 1. Request password reset (send reset email)
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    console.log("📧 Password reset request for:", email);

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    db.get('SELECT id, email, name FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        // ✅ For security: Always return success (prevents email enumeration)
        if (!user) {
            return res.json({ 
                message: 'If an account exists with this email, a reset link will be sent.' 
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { id: user.id, email: user.email, purpose: 'password-reset' },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        
        db.run(
            'INSERT OR REPLACE INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, resetToken, expiryTime],
            async (err) => {
                if (err) {
                    console.error('Error storing reset token:', err);
                    return res.status(500).json({ message: 'Failed to generate reset token' });
                }

                // ✅ Build reset URL
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
                
                try {
                    console.log("📤 Sending reset email via Gmail to:", email);

                    // ✅ Send email using Gmail SMTP
                    await transporter.sendMail({
                        from: `"GK Learning Platform" <${process.env.GMAIL_USER}>`,
                        to: email,
                        subject: 'Reset Your Password - GK Learning',
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            </head>
                            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                                    <tr>
                                        <td align="center">
                                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                                <tr>
                                                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 40px 30px;">
                                                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                                            Hi <strong>${user.name}</strong>,
                                                        </p>
                                                        <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                                                            We received a request to reset your password for your GK Learning Platform account. Click the button below to create a new password:
                                                        </p>
                                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                                                            Or copy and paste this link in your browser:
                                                        </p>
                                                        <p style="color: #667eea; font-size: 13px; word-break: break-all; background-color: #f8f9fa; padding: 12px; border-radius: 6px; margin: 0 0 20px;">
                                                            ${resetUrl}
                                                        </p>
                                                        <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 20px 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                                                            ⏰ This link will expire in <strong>1 hour</strong>.<br>
                                                            🔒 If you didn't request this, please ignore this email and your password will remain unchanged.
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                                                        <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.5;">
                                                            © ${new Date().getFullYear()} GK Learning Platform. All rights reserved.<br>
                                                            This is an automated email, please do not reply.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </body>
                            </html>
                        `
                    });

                    console.log('✅ Password reset email sent successfully via Gmail');
                    
                    return res.json({ 
                        message: 'If an account exists with this email, a reset link will be sent.',
                        // ⚠️ Only for development
                        ...(process.env.NODE_ENV === 'development' && {
                            devInfo: {
                                resetLink: resetUrl
                            }
                        })
                    });

                } catch (emailError) {
                    console.error('❌ Error sending email via Gmail:', emailError);
                    // Still return success to prevent email enumeration
                    return res.json({ 
                        message: 'If an account exists with this email, a reset link will be sent.' 
                    });
                }
            }
        );
    });
});

// 2. Verify reset token
app.get('/api/auth/verify-reset-token/:token', (req, res) => {
    const { token } = req.params;

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        if (decoded.purpose !== 'password-reset') {
            return res.status(401).json({ message: 'Invalid token purpose' });
        }

        db.get(
            'SELECT * FROM password_resets WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime("now")',
            [token],
            (err, reset) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                if (!reset) return res.status(401).json({ message: 'Token not found or expired' });

                return res.json({ 
                    valid: true, 
                    email: decoded.email 
                });
            }
        );
    });
});

// 3. Reset password with token
app.post('/api/auth/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        if (decoded.purpose !== 'password-reset') {
            return res.status(401).json({ message: 'Invalid token purpose' });
        }

        db.get(
            'SELECT * FROM password_resets WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime("now")',
            [token],
            (err, reset) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                if (!reset) return res.status(401).json({ message: 'Token not found, expired, or already used' });

                const hashedPassword = bcrypt.hashSync(newPassword, 8);

                db.run(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [hashedPassword, decoded.id],
                    (err) => {
                        if (err) return res.status(500).json({ message: 'Failed to update password' });

                        db.run(
                            'UPDATE password_resets SET used = 1 WHERE token = ?',
                            [token],
                            (err) => {
                                if (err) console.error('Failed to mark token as used:', err);

                                return res.json({ message: 'Password reset successfully' });
                            }
                        );
                    }
                );
            }
        );
    });
});

// --- GK Helper Function ---

const extractGKFromNews = (articles) => {
    const gkKeywords = [
        'launched', 'appointed', 'won', 'announced', 'signed', 'inaugurated', 'record', 'first', 'new', 'scheme',
        'died', 'born', 'award', 'medal', 'cup', 'champion', 'president', 'prime minister', 'chief minister',
        'summit', 'conference', 'meeting', 'deal', 'agreement', 'budget', 'gdp', 'growth', 'rank', 'index'
    ];
    
    const today = new Date().toISOString().split('T')[0];
    
    articles.forEach(article => {
        const title = article.title;
        const description = article.description;
        const sourceUrl = article.url;
        
        let isGK = gkKeywords.some(keyword => title.toLowerCase().includes(keyword));
        
        if (!isGK) {
             const hasNumber = /\d+/.test(title);
             if (hasNumber && title.length > 20) isGK = true;
        }

        if (isGK) {
            db.get('SELECT id FROM gk_points WHERE source_url = ?', [sourceUrl], (err, row) => {
                if (!row) {
                    let priority = 'Low';
                    if (title.toLowerCase().includes('india') || title.toLowerCase().includes('first') || title.toLowerCase().includes('record')) {
                        priority = 'High';
                    } else if (title.toLowerCase().includes('appointed') || title.toLowerCase().includes('won')) {
                        priority = 'Medium';
                    }

                    const content = title + ' - ' + description;
                    let category = 'General';
                    if (title.toLowerCase().includes('sport') || title.toLowerCase().includes('cricket') || title.toLowerCase().includes('olympic')) category = 'Sports';
                    else if (title.toLowerCase().includes('bank') || title.toLowerCase().includes('economy') || title.toLowerCase().includes('rbi')) category = 'Economy';
                    else if (title.toLowerCase().includes('minister') || title.toLowerCase().includes('govt') || title.toLowerCase().includes('parliament')) category = 'Polity';
                    else if (title.toLowerCase().includes('award') || title.toLowerCase().includes('honor')) category = 'Awards';

                    db.run('INSERT INTO gk_points (content, category, priority, source_url, date) VALUES (?, ?, ?, ?, ?)', 
                        [content, category, priority, sourceUrl, today], (err) => {
                            if (err) {
                                console.error('Error inserting GK point:', err);
                            } else {
                                console.log('✅ GK point stored for date:', today);
                            }
                        });
                }
            });
        }
    });
};

// --- News Routes ---

const fetchGNews = async (url, key) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT data, fetched_at FROM news_cache WHERE query_key = ?', [key], async (err, row) => {
            if (err) return reject(err);
            
            if (row) {
                const cacheTime = new Date(row.fetched_at).getTime();
                const now = new Date().getTime();
                if (now - cacheTime < 6 * 60 * 60 * 1000) {
                    console.log(`✅ Using cached data for: ${key} (cached ${Math.floor((now - cacheTime) / 60000)} minutes ago)`);
                    const cachedData = JSON.parse(row.data);
                    
                    // ✅ IMPORTANT: Store cached articles in archive too
                    if (cachedData.articles) {
                        cachedData.articles.forEach(article => {
                            db.get('SELECT id FROM news_archive WHERE url = ?', [article.url], (err, existingRow) => {
                                if (!existingRow) {
                                    let category = 'General';
                                    
                                    if (key === 'top-headlines-in') {
                                        category = 'Indian';
                                    } else if (key === 'top-headlines-us' || key === 'top-headlines-uk' || key === 'search-world') {
                                        category = 'Global';
                                    }
                                    
                                    db.run('INSERT INTO news_archive (title, description, url, image_url, source_name, published_at, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                        [article.title, article.description, article.url, article.image, article.source.name, article.publishedAt, category]);
                                }
                            });
                        });
                    }
                    
                    return resolve(cachedData);
                }
            }

            try {
                console.log('Fetching from GNews API: ' + key);
                const response = await axios.get(url);
                const data = response.data;
                
                const dataString = JSON.stringify(data);
                if (row) {
                    db.run('UPDATE news_cache SET data = ?, fetched_at = CURRENT_TIMESTAMP WHERE query_key = ?', [dataString, key]);
                } else {
                    db.run('INSERT INTO news_cache (query_key, data) VALUES (?, ?)', [key, dataString]);
                }
                
                // Store articles in archive
                if (data.articles) {
                    data.articles.forEach(article => {
                         db.get('SELECT id FROM news_archive WHERE url = ?', [article.url], (err, row) => {
                             if (!row) {
                                 // Improved category detection
                                 let category = 'General';
                                 
                                 if (key === 'top-headlines-in') {
                                     category = 'Indian';
                                 } else if (key === 'top-headlines-us' || key === 'top-headlines-uk' || key === 'search-world') {
                                     category = 'Global';
                                 }
                                 
                                 console.log(`✅ Storing article with category: ${category} from key: ${key}`);
                                 
                                 db.run('INSERT INTO news_archive (title, description, url, image_url, source_name, published_at, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                     [article.title, article.description, article.url, article.image, article.source.name, article.publishedAt, category]);
                             }
                         });
                    });
                }

                if (key === 'top-headlines-in') {
                    extractGKFromNews(data.articles);
                }

                resolve(data);
            } catch (error) {
                console.error("Error fetching news:", error.message);
                if (row) return resolve(JSON.parse(row.data));
                reject(error);
            }
        });
    });
};

// ✅ ENHANCED: Fetch multiple global news sources for better balance
const fetchMultipleGlobalNews = async () => {
    const globalQueries = [
        { url: `https://gnews.io/api/v4/top-headlines?country=us&apikey=${GNEWS_API_KEY}&lang=en&max=10`, key: 'top-headlines-us' },
        { url: `https://gnews.io/api/v4/top-headlines?country=gb&apikey=${GNEWS_API_KEY}&lang=en&max=10`, key: 'top-headlines-uk' },
        { url: `https://gnews.io/api/v4/search?q=world&apikey=${GNEWS_API_KEY}&lang=en&max=10`, key: 'search-world' }
    ];

    const results = [];
    for (const query of globalQueries) {
        try {
            const data = await fetchGNews(query.url, query.key);
            if (data.articles) {
                results.push(...data.articles);
            }
        } catch (error) {
            console.error(`Error fetching ${query.key}:`, error.message);
        }
    }
    
    return { articles: results };
};

// =====================================================
// ✅ NEWS ROUTES WITH FALLBACK SAFETY
// =====================================================

app.get('/api/news/indian', async (req, res) => {
    try {
        // ✅ Fallback Safety: Check if cache is stale (>24 hours)
        const cacheCheck = await new Promise((resolve) => {
            db.get(
                "SELECT fetched_at FROM news_cache WHERE query_key = 'top-headlines-in'",
                (err, row) => resolve(row)
            );
        });

        if (cacheCheck) {
            const hoursSinceLastFetch = (Date.now() - new Date(cacheCheck.fetched_at)) / (1000 * 60 * 60);
            
            if (hoursSinceLastFetch > 26) {
                console.log(`⚠️ Indian news cache is ${Math.round(hoursSinceLastFetch)} hours old - forcing refresh`);
                await new Promise((resolve) => {
                    db.run("DELETE FROM news_cache WHERE query_key = 'top-headlines-in'", () => resolve());
                });
            }
        }

        const url = `https://gnews.io/api/v4/top-headlines?country=in&apikey=${GNEWS_API_KEY}&lang=en&max=30`;
        const data = await fetchGNews(url, 'top-headlines-in');
        return res.json(data);
    } catch (error) {
        console.error('Error in /api/news/indian:', error);
        return res.status(500).json({ message: 'Failed to fetch news' });
    }
});

app.get('/api/news/global', async (req, res) => {
    try {
        // ✅ Fallback Safety: Check cache age for all global sources
        const globalKeys = ['top-headlines-us', 'top-headlines-uk', 'search-world'];
        
        for (const key of globalKeys) {
            const cacheCheck = await new Promise((resolve) => {
                db.get(
                    "SELECT fetched_at FROM news_cache WHERE query_key = ?",
                    [key],
                    (err, row) => resolve(row)
                );
            });

            if (cacheCheck) {
                const hoursSinceLastFetch = (Date.now() - new Date(cacheCheck.fetched_at)) / (1000 * 60 * 60);
                
                if (hoursSinceLastFetch > 26) {
                    console.log(`⚠️ Global cache '${key}' is ${Math.round(hoursSinceLastFetch)} hours old - forcing refresh`);
                    await new Promise((resolve) => {
                        db.run("DELETE FROM news_cache WHERE query_key = ?", [key], () => resolve());
                    });
                }
            }
        }

        const data = await fetchMultipleGlobalNews();
        return res.json(data);
    } catch (error) {
        console.error('Error in /api/news/global:', error);
        return res.status(500).json({ message: 'Failed to fetch news' });
    }
});

// ✅ ENHANCED: Balanced archive endpoint
app.get('/api/news/archive', async (req, res) => {
    db.all('SELECT * FROM news_archive ORDER BY published_at DESC', (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        console.log(`📰 Total articles in database: ${rows.length}`);
        
        // Filter to keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        
        const recentNews = rows.filter(article => {
            if (!article.published_at) return false;
            
            const publishedDate = new Date(article.published_at);
            const isValid = !isNaN(publishedDate.getTime());
            const isRecent = publishedDate >= thirtyDaysAgo;
            
            return isValid && isRecent;
        });
        
        console.log(`📅 Articles from last 30 days: ${recentNews.length}`);
        
        // Separate by category
        const indian = recentNews.filter(r => r.category === 'Indian');
        const global = recentNews.filter(r => r.category === 'Global');
        const general = recentNews.filter(r => r.category === 'General' || !r.category);
        
        console.log(`📊 Archive breakdown - Indian: ${indian.length}, Global: ${global.length}, General: ${general.length}`);
        
        // Create balanced mix: prioritize equal representation
        const maxPerCategory = 1000;
        const balanced = [
            ...indian.slice(0, maxPerCategory),
            ...global.slice(0, maxPerCategory),
            ...general.slice(0, 20)
        ].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        
        console.log(`✅ Returning ${balanced.length} balanced articles to frontend`);
        
        return res.json(balanced);
    });
});

// server.js

// Replace your /api/news/fetch-content endpoint with this complete version

// Article content cache (in-memory)
const articleCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Replace your /api/news/fetch-content endpoint with this complete version

app.get('/api/news/fetch-content', async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ 
      success: false, 
      message: 'URL is required' 
    });
  }

  // Check cache first
  const cached = articleCache.get(url);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    console.log('✅ Returning cached article:', url);
    return res.json({
      success: true,
      article: cached.article
    });
  }

  console.log('📰 Fetching article:', url);

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  };

  try {
    // Quick timeout for faster failures
    const response = await axios.get(url, {
      headers,
      timeout: 15000, // Reduced to 15 seconds for faster response
      maxRedirects: 3, // Reduced redirects
      responseType: 'text',
      validateStatus: (status) => status < 500,
      decompress: true // Auto decompress gzip
    });

    if (response.status >= 400) {
      console.log(`⚠️ Server returned status ${response.status}`);
      return res.json({
        success: false,
        message: `Cannot access article (HTTP ${response.status}). The site may be blocking automated access.`
      });
    }

    const finalUrl = response.request?.res?.responseUrl || url;
    
    // Suppress JSDOM warnings
  // Better error suppression in production
const virtualConsole = process.env.NODE_ENV === 'production' 
  ? new (require('jsdom').VirtualConsole)() 
  : undefined;

if (virtualConsole) {
  virtualConsole.on('error', () => {});
  virtualConsole.on('warn', () => {});
}

const dom = new JSDOM(response.data, { 
  url: finalUrl,
  ...(virtualConsole && { virtualConsole })
});
    const doc = dom.window.document;

    // Remove unwanted elements
    [
      'script', 'style', 'noscript', 'iframe', 'nav', 'footer', 
      'header', 'aside', 'form', '.ad', '.advertisement', 
      '#comments', '.social-share', '.related-articles', '.cookie-banner'
    ].forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Try Readability first
    const reader = new Readability(doc);
    let article = reader.parse();

    // Enhanced fallback if Readability fails
    if (!article || !article.content || article.content.trim().length < 200) {
      console.log('⚠️ Readability failed → using enhanced fallback');

      // Try multiple content selectors
      const contentSelectors = [
        'article',
        '[role="main"]',
        '[itemprop="articleBody"]',
        '.article-content',
        '.post-content',
        '.entry-content',
        '.content-body',
        '.story-body',
        'main article',
        'main'
      ];

      let contentContainer = null;
      for (const selector of contentSelectors) {
        contentContainer = doc.querySelector(selector);
        if (contentContainer && contentContainer.textContent.trim().length > 200) {
          console.log(`✅ Found content using: ${selector}`);
          break;
        }
      }

      // Extract paragraphs
      const searchRoot = contentContainer || doc.body;
      const paragraphs = Array.from(searchRoot.querySelectorAll('p'))
        .map(p => p.textContent.trim())
        .filter(text => {
          return text.length > 50 && 
                 !text.toLowerCase().includes('cookie') &&
                 !text.toLowerCase().includes('subscribe') &&
                 !text.toLowerCase().includes('sign up') &&
                 !text.toLowerCase().includes('newsletter');
        });

      if (!paragraphs.length || paragraphs.join('').length < 200) {
        console.log('❌ No valid content found');
        return res.json({
          success: false,
          message: 'Unable to extract article content. This site may be blocking automated access or requires login.'
        });
      }

      // Get title
      const title = doc.querySelector('h1')?.textContent?.trim() ||
                   doc.querySelector('[itemprop="headline"]')?.textContent?.trim() ||
                   doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                   doc.title.split('-')[0].trim() ||
                   'Article';

      // Get author
      const byline = doc.querySelector('[itemprop="author"]')?.textContent?.trim() ||
                    doc.querySelector('.author')?.textContent?.trim() ||
                    doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
                    null;

      const htmlContent = paragraphs.map(p => `<p>${p}</p>`).join('');
      const textContent = paragraphs.join('\n\n');

      article = {
        title: title,
        content: htmlContent,
        textContent: textContent,
        excerpt: paragraphs[0]?.slice(0, 200) + '...',
        siteName: new URL(finalUrl).hostname.replace('www.', ''),
        byline: byline,
        length: textContent.length
      };
    }

    // Final validation
    if (!article || !article.content || article.content.trim().length < 100) {
      console.log('❌ Extracted content too short');
      return res.json({
        success: false,
        message: 'Article content is too short or empty. The site may be restricting access.'
      });
    }

    // Clean up article data
    const cleanArticle = {
      title: article.title || 'Article',
      content: article.content,
      textContent: article.textContent || article.content.replace(/<[^>]*>/g, ''),
      excerpt: article.excerpt || article.textContent?.slice(0, 200) + '...',
      siteName: article.siteName || new URL(finalUrl).hostname.replace('www.', ''),
      byline: article.byline || null,
      length: article.length || article.content.length
    };

    console.log(`✅ Article extracted: "${cleanArticle.title}" (${cleanArticle.length} chars)`);

    // Store in cache
    articleCache.set(url, {
      article: cleanArticle,
      timestamp: Date.now()
    });

    // Limit cache size to 100 articles
    if (articleCache.size > 100) {
      const firstKey = articleCache.keys().next().value;
      articleCache.delete(firstKey);
    }

    return res.json({
  success: true,
  article: {
    title: article.title,
    content: article.content,
    textContent: article.textContent,
    length: article.length,
    excerpt: article.excerpt,
    siteName: article.siteName
  }
});

    // return res.json({
    //   success: true,
    //   article: cleanArticle
    // });

  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.json({
        success: false,
        message: 'Request timeout. The article is taking too long to load. Please try again or visit the original site.'
      });
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.json({
        success: false,
        message: 'Cannot connect to the website. The site may be down or the URL is invalid.'
      });
    }

    return res.json({
      success: false,
      message: 'Failed to fetch article. The site may be blocking automated access or requires login.'
    });
  }
});


// =====================================================
// ✅ WRAPPER FUNCTIONS FOR MOCK DATA
// =====================================================

const getMockYearlyData = (year) => {
    return mockYearlyData[year] || [];
};

const getMockMonthlyData2025 = (month) => {
    const paddedMonth = month.padStart(2, '0');
    return mockMonthlyData[paddedMonth] || [];
};

const attachBookmarksAndSend = (rows, userId, res) => {
    db.all(
        'SELECT gk_id FROM bookmarks WHERE user_id = ?',
        [userId],
        (err, bookmarks) => {
            if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });

            const bookmarkedIds = bookmarks.map(b => b.gk_id);

            const result = rows.map(item => ({
                ...item,
                isBookmarked: bookmarkedIds.includes(item.id)
            }));

            return res.json(result);
        }
    );
};

// =====================================================
// GK ROUTES WITH MOCK DATA INTEGRATION
// =====================================================

app.get('/api/gk/today', verifyToken, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    db.all('SELECT * FROM gk_points WHERE date = ? ORDER BY id DESC', [today], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        db.all('SELECT gk_id FROM bookmarks WHERE user_id = ?', [req.userId], (err, bookmarks) => {
            if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
            
            const bookmarkedIds = bookmarks ? bookmarks.map(b => b.gk_id) : [];
            const result = rows.map(row => ({
                ...row,
                isBookmarked: bookmarkedIds.includes(row.id)
            }));
            return res.json(result);
        });
    });
});

app.post('/api/gk/bookmark', verifyToken, (req, res) => {
    const { gk_id } = req.body;
    db.run('INSERT OR IGNORE INTO bookmarks (user_id, gk_id) VALUES (?, ?)', [req.userId, gk_id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        return res.json({ message: 'Bookmarked' });
    });
});

app.delete('/api/gk/bookmark/:gk_id', verifyToken, (req, res) => {
    const { gk_id } = req.params;
    db.run('DELETE FROM bookmarks WHERE user_id = ? AND gk_id = ?', [req.userId, gk_id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        return res.json({ message: 'Bookmark removed' });
    });
});

app.get('/api/gk/bookmarks', verifyToken, (req, res) => {
    db.all('SELECT g.* FROM gk_points g JOIN bookmarks b ON g.id = b.gk_id WHERE b.user_id = ?', [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        return res.json(rows.map(row => ({...row, isBookmarked: true})));
    });
});

// ✅ FIXED DAILY GK ROUTE - No more duplicate responses
app.get('/api/gk/date/:date', verifyToken, (req, res) => {
    const { date } = req.params;

    db.all('SELECT * FROM gk_points WHERE date = ?', [date], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        // ✅ If database has data, attach bookmarks and send
        if (rows.length > 0) {
            return db.all(
                'SELECT gk_id FROM bookmarks WHERE user_id = ?',
                [req.userId],
                (err, bookmarks) => {
                    if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
                    
                    const bookmarkedIds = bookmarks.map(b => b.gk_id);
                    const result = rows.map(row => ({
                        ...row,
                        isBookmarked: bookmarkedIds.includes(row.id)
                    }));
                    return res.json(result);
                }
            );
        }

        // ✅ No DB data - check for mock data
        const [yearStr, monthStr, dayStr] = date.split('-');
        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);

        if (year === 2025 && month === 12 && day >= 1 && day <= 27) {
            const dateData = getMockDailyDataDecember2025(date);
            console.log(`✅ Returning ${dateData.length} mock entries for ${date}`);
            return res.json(dateData);
        }

        console.log(`⚠️ No data found for ${date}`);
        return res.json([]);
    });
});

// ✅ FIXED MONTHLY GK ROUTE
app.get('/api/gk/month/:year/:month', verifyToken, (req, res) => {
    const { year, month } = req.params;
    
    const paddedMonth = month.padStart(2, '0');
    const datePattern = year + '-' + paddedMonth + '-%';
    
    console.log(`📅 Monthly request: Year=${year}, Month=${paddedMonth}, Pattern=${datePattern}`);
    
    db.all('SELECT * FROM gk_points WHERE date LIKE ? ORDER BY date DESC', [datePattern], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        // For 2025, combine mock data with database data
        if (year === '2025') {
            const mockData = getMockMonthlyData2025(paddedMonth);
            
            console.log(`📊 Mock data entries: ${mockData.length}, DB entries: ${rows.length}`);
            
            // Special handling for December: combine mock (1-27) + DB (28+)
            if (paddedMonth === '12') {
                const decemberDailyData = getMockDailyDataDecember2025();
                const allDecemberMock = Object.values(decemberDailyData).flat();
                
                const combined = [...allDecemberMock, ...rows];
                
                const uniqueMap = {};
                combined.forEach(item => {
                    if (!uniqueMap[item.date]) {
                        uniqueMap[item.date] = [];
                    }
                    uniqueMap[item.date].push(item);
                });
                
                const unique = Object.values(uniqueMap).flat().sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                
                console.log(`✅ December combined: ${unique.length} total entries`);
                return attachBookmarksAndSend(unique, req.userId, res);
            }
            
            // For other months (Jan-Nov), return mock data if DB is empty
            if (rows.length > 0) {
                console.log(`✅ Returning ${rows.length} DB entries for ${paddedMonth}`);
                return attachBookmarksAndSend(rows, req.userId, res);
            }
            
            console.log(`✅ Returning ${mockData.length} mock entries for ${paddedMonth}`);
            return res.json(mockData);
        }
        
        // For non-2025 years, return database data
        console.log(`✅ Returning ${rows.length} entries for year ${year}`);
        return attachBookmarksAndSend(rows, req.userId, res);
    });
});

// ✅ FIXED YEARLY GK ROUTE
app.get('/api/gk/yearly/:year', verifyToken, (req, res) => {
    const { year } = req.params;
    const datePattern = year + '-%';
    
    db.all('SELECT * FROM gk_points WHERE date LIKE ? ORDER BY date DESC', [datePattern], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        if (rows.length > 0) {
            return attachBookmarksAndSend(rows, req.userId, res);
        }
        
        const mockData = getMockYearlyData(year);
        if (mockData.length > 0) {
            return attachBookmarksAndSend(mockData, req.userId, res);
        }
        
        return res.json([]);
    });
});

// =====================================================
// ✅ DASHBOARD & ACTIVITY ROUTES
// =====================================================

app.post('/api/activity', verifyToken, (req, res) => {
    const { type, gk_id } = req.body;

    db.run(
    'INSERT INTO user_activity (user_id, activity_type, gk_id) VALUES (?, ?, ?)',
    [req.userId, type, gk_id || null],
    (err) => {
        if (err) {
        console.error('Failed to log activity:', err);
        return res.status(500).json({ message: 'Failed to log activity' });
        }
        return res.json({ message: 'Activity logged successfully' });
    }
);

});

app.get('/api/dashboard/summary', verifyToken, (req, res) => {
  const userId = req.userId;

  db.all(
    'SELECT DISTINCT date(created_at) as activity_date FROM user_activity WHERE user_id = ? ORDER BY activity_date DESC',
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (rows.length > 0) {
        const mostRecent = new Date(rows[0].activity_date);
        mostRecent.setHours(0, 0, 0, 0);

        const diff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
        if (diff <= 1) {
          for (let i = 0; i < rows.length; i++) {
            const expected = new Date(mostRecent);
            expected.setDate(mostRecent.getDate() - i);
            expected.setHours(0, 0, 0, 0);

            const actual = new Date(rows[i].activity_date);
            actual.setHours(0, 0, 0, 0);

            if (actual.getTime() === expected.getTime()) streak++;
            else break;
          }
        }
      }

      const activeDays = rows.length;

      db.get(
        'SELECT COUNT(*) as totalActivities FROM user_activity WHERE user_id = ?',
        [userId],
        (err, totalRow) => {
          if (err) return res.status(500).json({ message: 'Database error' });

          return res.json({
            streak,
            activeDays,
            totalActivities: totalRow.totalActivities || 0
          });
        }
      );
    }
  );
});

// =====================================================
// SCHEDULED TASKS
// =====================================================

// // ✅ ENHANCED: Fetch from multiple sources for better balance
// cron.schedule('0 0 * * *', async () => {
//     console.log('🕐 Running daily news fetch and GK extraction...');
    
//     // Fetch Indian news
//     const indianUrl = `https://gnews.io/api/v4/top-headlines?country=in&apikey=${GNEWS_API_KEY}&lang=en&max=30`;
//     await fetchGNews(indianUrl, 'top-headlines-in');
    
//     // Fetch Global news from multiple sources
//     await fetchMultipleGlobalNews();
    
//     console.log('✅ Daily news fetch completed');
// });

// // Clean up old news once per day at 1 AM (separate from main fetch)
// cron.schedule('0 1 * * *', () => {
//     console.log('🧹 Running cleanup of old news...');
//     db.run('DELETE FROM news_archive WHERE datetime(published_at) < datetime(\'now\', \'-30 days\')', (err) => {
//         if (err) {
//             console.error("❌ Error cleaning up old news:", err);
//         } else {
//             console.log("✅ Cleaned up old news archive (30+ days)");
//         }
//     });
// });




// Corn Handling using GitHub Actions
// =====================================================
// ✅ SECURE CRON ENDPOINT (GitHub Actions Trigger)
// =====================================================

app.get('/api/cron/trigger', async (req, res) => {
    // 1️⃣ Security: Verify secret token
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('❌ Unauthorized cron attempt');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('✅ Authorized cron job started');

    try {
        // 2️⃣ Delete old news (30+ days)
        await new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM news_archive WHERE datetime(published_at) < datetime('now', '-30 days')",
                function(err) {
                    if (err) {
                        console.error('❌ Cleanup error:', err);
                        reject(err);
                    } else {
                        console.log(`🧹 Deleted ${this.changes} old articles`);
                        resolve();
                    }
                }
            );
        });

        // 3️⃣ Check if already fetched today
        const today = new Date().toISOString().split('T')[0];
        const lastFetch = await new Promise((resolve, reject) => {
            db.get(
                "SELECT fetched_at FROM news_cache WHERE query_key = 'cron-daily-check'",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (lastFetch) {
            const lastFetchDate = new Date(lastFetch.fetched_at).toISOString().split('T')[0];
            if (lastFetchDate === today) {
                console.log('⏭️ Already fetched today, skipping');
                return res.json({ 
                    message: 'Already updated today', 
                    lastFetch: lastFetchDate 
                });
            }
        }

        // 4️⃣ Fetch fresh news
        console.log('📰 Fetching fresh news...');
        
        // Fetch Indian news
        const indianUrl = `https://gnews.io/api/v4/top-headlines?country=in&apikey=${GNEWS_API_KEY}&lang=en&max=30`;
        await fetchGNews(indianUrl, 'top-headlines-in');
        
        // Fetch Global news
        await fetchMultipleGlobalNews();

        // 5️⃣ Update daily check timestamp
        await new Promise((resolve, reject) => {
            db.run(
                "INSERT OR REPLACE INTO news_cache (query_key, data, fetched_at) VALUES ('cron-daily-check', '{}', CURRENT_TIMESTAMP)",
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log('✅ Cron job completed successfully');
        return res.json({ 
            message: 'News updated successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Cron job failed:', error);
        return res.status(500).json({ 
            message: 'Cron job failed', 
            error: error.message 
        });
    }
});

// =====================================================
// SERVE STATIC FILES
// =====================================================

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log('✅ Server running on port ' + PORT);
    console.log('✅ Mock data loaded from separate files');
    console.log('⏰ Daily news handled via GitHub Actions cron');
    console.log('✅ Balanced news fetching enabled (Indian + Global)');
    console.log('📅 Current date:', new Date().toISOString().split('T')[0]);
    console.log('📁 SQLite DB location:', path.join(__dirname, 'database.db'));

});