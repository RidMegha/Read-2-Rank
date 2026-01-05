const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

require('dotenv').config();

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Gmail SMTP configuration error:', error);
    } else {
        console.log('✅ Gmail SMTP is ready to send emails');
    }
});

const { mockYearlyData, mockMonthlyData, getMockDailyDataDecember2025 } = require('./data');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://read-2-rank.onrender.com'
].filter(Boolean);

console.log('✅ Allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed for:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked for:', origin);
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL'
  });
});

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

// Authentication & User Routes
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, exam_type } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    // Insert user and get the ID
    db.run('INSERT INTO users (name, email, password, exam_type) VALUES ($1, $2, $3, $4)', 
        [name, email, hashedPassword, exam_type], 
        function(err) {
            if (err) {
                if (err.message.includes('unique') || err.code === '23505') {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                console.error('Signup error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            
            // Fetch the newly created user to get their ID
            db.get('SELECT id, name, email, exam_type FROM users WHERE email = $1', [email], (err, user) => {
                if (err) {
                    console.error('Error fetching new user:', err);
                    return res.status(500).json({ message: 'Database error' });
                }
                if (!user) {
                    return res.status(500).json({ message: 'User created but could not retrieve data' });
                }
                
                const token = generateToken({ id: user.id, email });
                return res.status(201).json({ 
                    token, 
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        exam_type: user.exam_type 
                    } 
                });
            });
        }
    );
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = $1', [email], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' });
        const token = generateToken(user);
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, exam_type: user.exam_type } });
    });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
    db.get('SELECT id, name, email, exam_type, created_at FROM users WHERE id = $1', [req.userId], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user);
    });
});

app.put('/api/auth/profile', verifyToken, (req, res) => {
    const { name, exam_type } = req.body;
    db.run('UPDATE users SET name = $1, exam_type = $2 WHERE id = $3', [name, exam_type, req.userId], function(err) {
        if (err) return res.status(500).json({ message: 'Database error' });
        db.get('SELECT id, name, email, exam_type FROM users WHERE id = $1', [req.userId], (err, user) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            return res.json(user);
        });
    });
});

app.put('/api/auth/password', verifyToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    db.get('SELECT password FROM users WHERE id = $1', [req.userId], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
        if (!passwordIsValid) return res.status(401).json({ message: 'Invalid current password' });
        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        db.run('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.userId], (err) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            return res.json({ message: 'Password updated successfully' });
        });
    });
});

// Password Reset Routes
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log("📧 Password reset request for:", email);
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    db.get('SELECT id, email, name FROM users WHERE email = $1', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) {
            return res.json({ 
                message: 'If an account exists with this email, a reset link will be sent.' 
            });
        }
        const resetToken = jwt.sign(
            { id: user.id, email: user.email, purpose: 'password-reset' },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        db.run(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3) ON CONFLICT (token) DO UPDATE SET user_id = EXCLUDED.user_id, expires_at = EXCLUDED.expires_at',
            [user.id, resetToken, expiryTime],
            async (err) => {
                if (err) {
                    console.error('Error storing reset token:', err);
                    return res.status(500).json({ message: 'Failed to generate reset token' });
                }
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
                try {
                    console.log("📤 Sending reset email via Gmail to:", email);
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
                        ...(process.env.NODE_ENV === 'development' && {
                            devInfo: { resetLink: resetUrl }
                        })
                    });
                } catch (emailError) {
                    console.error('❌ Error sending email via Gmail:', emailError);
                    return res.json({ 
                        message: 'If an account exists with this email, a reset link will be sent.' 
                    });
                }
            }
        );
    });
});

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
            'SELECT * FROM password_resets WHERE token = $1 AND used = 0 AND expires_at > CURRENT_TIMESTAMP',
            [token],
            (err, reset) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                if (!reset) return res.status(401).json({ message: 'Token not found or expired' });
                return res.json({ valid: true, email: decoded.email });
            }
        );
    });
});

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
            'SELECT * FROM password_resets WHERE token = $1 AND used = 0 AND expires_at > CURRENT_TIMESTAMP',
            [token],
            (err, reset) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                if (!reset) return res.status(401).json({ message: 'Token not found, expired, or already used' });
                const hashedPassword = bcrypt.hashSync(newPassword, 8);
                db.run('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, decoded.id], (err) => {
                    if (err) return res.status(500).json({ message: 'Failed to update password' });
                    db.run('UPDATE password_resets SET used = 1 WHERE token = $1', [token], (err) => {
                        if (err) console.error('Failed to mark token as used:', err);
                        return res.json({ message: 'Password reset successfully' });
                    });
                });
            }
        );
    });
});

// GK Helper Function
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
            db.get('SELECT id FROM gk_points WHERE source_url = $1', [sourceUrl], (err, row) => {
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
                    db.run('INSERT INTO gk_points (content, category, priority, source_url, date) VALUES ($1, $2, $3, $4, $5)', 
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

// News Routes
const fetchGNews = async (url, key) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT data, fetched_at FROM news_cache WHERE query_key = $1', [key], async (err, row) => {
            if (err) return reject(err);
            if (row) {
                const cacheTime = new Date(row.fetched_at).getTime();
                const now = new Date().getTime();
                if (now - cacheTime < 8 * 60 * 60 * 1000) {
                    console.log(`✅ Using cached data for: ${key} (cached ${Math.floor((now - cacheTime) / 60000)} minutes ago)`);
                    const cachedData = JSON.parse(row.data);
                    if (cachedData.articles) {
                        cachedData.articles.forEach(article => {
                            db.get('SELECT id FROM news_archive WHERE url = $1', [article.url], (err, existingRow) => {
                                if (!existingRow) {
                                    let category = 'General';
                                    if (key === 'top-headlines-in') {
                                        category = 'Indian';
                                    } else if (key === 'top-headlines-us' || key === 'top-headlines-uk' || key === 'search-world') {
                                        category = 'Global';
                                    }
                                    db.run('INSERT INTO news_archive (title, description, url, image_url, source_name, published_at, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
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
                    db.run('UPDATE news_cache SET data = $1, fetched_at = CURRENT_TIMESTAMP WHERE query_key = $2', [dataString, key]);
                } else {
                    db.run('INSERT INTO news_cache (query_key, data) VALUES ($1, $2)', [key, dataString]);
                }
                if (data.articles) {
                    data.articles.forEach(article => {
                         db.get('SELECT id FROM news_archive WHERE url = $1', [article.url], (err, row) => {
                             if (!row) {
                                 let category = 'General';
                                 if (key === 'top-headlines-in') {
                                     category = 'Indian';
                                 } else if (key === 'top-headlines-us' || key === 'top-headlines-uk' || key === 'search-world') {
                                     category = 'Global';
                                 }
                                 console.log(`✅ Storing article with category: ${category} from key: ${key}`);
                                 db.run('INSERT INTO news_archive (title, description, url, image_url, source_name, published_at, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
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

app.get('/api/news/indian', async (req, res) => {
    try {
        const cacheCheck = await new Promise((resolve) => {
            db.get("SELECT fetched_at FROM news_cache WHERE query_key = $1", ['top-headlines-in'], (err, row) => resolve(row));
        });
        if (cacheCheck) {
            const hoursSinceLastFetch = (Date.now() - new Date(cacheCheck.fetched_at)) / (1000 * 60 * 60);
            if (hoursSinceLastFetch > 26) {
                console.log(`⚠️ Indian news cache is ${Math.round(hoursSinceLastFetch)} hours old - forcing refresh`);
                await new Promise((resolve) => {
                    db.run("DELETE FROM news_cache WHERE query_key = $1", ['top-headlines-in'], () => resolve());
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
        const globalKeys = ['top-headlines-us', 'top-headlines-uk', 'search-world'];
        for (const key of globalKeys) {
            const cacheCheck = await new Promise((resolve) => {
                db.get("SELECT fetched_at FROM news_cache WHERE query_key = $1", [key], (err, row) => resolve(row));
            });
            if (cacheCheck) {
                const hoursSinceLastFetch = (Date.now() - new Date(cacheCheck.fetched_at)) / (1000 * 60 * 60);
                if (hoursSinceLastFetch > 26) {
                    console.log(`⚠️ Global cache '${key}' is ${Math.round(hoursSinceLastFetch)} hours old - forcing refresh`);
                    await new Promise((resolve) => {
                        db.run("DELETE FROM news_cache WHERE query_key = $1", [key], () => resolve());
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

app.get('/api/news/archive', async (req, res) => {
    db.all('SELECT * FROM news_archive ORDER BY published_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Archive fetch error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        // Safety check for rows
        if (!rows || !Array.isArray(rows)) {
            console.warn('No rows returned from database');
            return res.json([]);
        }
        
        console.log(`📰 Total articles in database: ${rows.length}`);
        
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
        
        const indian = recentNews.filter(r => r.category === 'Indian');
        const global = recentNews.filter(r => r.category === 'Global');
        const general = recentNews.filter(r => r.category === 'General' || !r.category);
        
        console.log(`📊 Archive breakdown - Indian: ${indian.length}, Global: ${global.length}, General: ${general.length}`);
        
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

const articleCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000;

app.get('/api/news/fetch-content', async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }
  const cached = articleCache.get(url);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    console.log('✅ Returning cached article:', url);
    return res.json({ success: true, article: cached.article });
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
    const response = await axios.get(url, {
      headers,
      timeout: 15000,
      maxRedirects: 3,
      responseType: 'text',
      validateStatus: (status) => status < 500,
      decompress: true
    });
    if (response.status >= 400) {
      console.log(`⚠️ Server returned status ${response.status}`);
      return res.json({ success: false, message: `Cannot access article (HTTP ${response.status}). The site may be blocking automated access.` });
    }
    const finalUrl = response.request?.res?.responseUrl || url;
    const virtualConsole = process.env.NODE_ENV === 'production' ? new (require('jsdom').VirtualConsole)() : undefined;
    if (virtualConsole) {
      virtualConsole.on('error', () => {});
      virtualConsole.on('warn', () => {});
    }
    const dom = new JSDOM(response.data, { url: finalUrl, ...(virtualConsole && { virtualConsole }) });
    const doc = dom.window.document;
    ['script', 'style', 'noscript', 'iframe', 'nav', 'footer', 'header', 'aside', 'form', '.ad', '.advertisement', '#comments', '.social-share', '.related-articles', '.cookie-banner'].forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove());
    });
    const reader = new Readability(doc);
    let article = reader.parse();
    if (!article || !article.content || article.content.trim().length < 200) {
      console.log('⚠️ Readability failed → using enhanced fallback');
      const contentSelectors = ['article', '[role="main"]', '[itemprop="articleBody"]', '.article-content', '.post-content', '.entry-content', '.content-body', '.story-body', 'main article', 'main'];
      let contentContainer = null;
      for (const selector of contentSelectors) {
        contentContainer = doc.querySelector(selector);
        if (contentContainer && contentContainer.textContent.trim().length > 200) {
          console.log(`✅ Found content using: ${selector}`);
          break;
        }
      }
      const searchRoot = contentContainer || doc.body;
      const paragraphs = Array.from(searchRoot.querySelectorAll('p'))
        .map(p => p.textContent.trim())
        .filter(text => {
          return text.length > 50 && !text.toLowerCase().includes('cookie') && !text.toLowerCase().includes('subscribe') && !text.toLowerCase().includes('sign up') && !text.toLowerCase().includes('newsletter');
        });
      if (!paragraphs.length || paragraphs.join('').length < 200) {
        console.log('❌ No valid content found');
        return res.json({ success: false, message: 'Unable to extract article content. This site may be blocking automated access or requires login.' });
      }
      const title = doc.querySelector('h1')?.textContent?.trim() || doc.querySelector('[itemprop="headline"]')?.textContent?.trim() || doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title.split('-')[0].trim() || 'Article';
      const byline = doc.querySelector('[itemprop="author"]')?.textContent?.trim() || doc.querySelector('.author')?.textContent?.trim() || doc.querySelector('meta[name="author"]')?.getAttribute('content') || null;
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
    if (!article || !article.content || article.content.trim().length < 100) {
      console.log('❌ Extracted content too short');
      return res.json({ success: false, message: 'Article content is too short or empty. The site may be restricting access.' });
    }
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
    articleCache.set(url, { article: cleanArticle, timestamp: Date.now() });
    if (articleCache.size > 100) {
      const firstKey = articleCache.keys().next().value;
      articleCache.delete(firstKey);
    }
    return res.json({ success: true, article: { title: article.title, content: article.content, textContent: article.textContent, length: article.length, excerpt: article.excerpt, siteName: article.siteName } });
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.json({ success: false, message: 'Request timeout. The article is taking too long to load. Please try again or visit the original site.' });
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.json({ success: false, message: 'Cannot connect to the website. The site may be down or the URL is invalid.' });
    }
    return res.json({ success: false, message: 'Failed to fetch article. The site may be blocking automated access or requires login.' });
  }
});

const getMockYearlyData = (year) => {
    return mockYearlyData[year] || [];
};

const getMockMonthlyData2025 = (month) => {
    const paddedMonth = month.padStart(2, '0');
    return mockMonthlyData[paddedMonth] || [];
};

const attachBookmarksAndSend = (rows, userId, res) => {
    db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [userId], (err, bookmarks) => {
        if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
        const bookmarkedIds = bookmarks.map(b => b.gk_id);
        const result = rows.map(item => ({ ...item, isBookmarked: bookmarkedIds.includes(item.id) }));
        return res.json(result);
    });
};

app.get('/api/gk/today', verifyToken, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    db.all('SELECT * FROM gk_points WHERE date = $1 ORDER BY id DESC', [today], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [req.userId], (err, bookmarks) => {
            if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
            const bookmarkedIds = bookmarks ? bookmarks.map(b => b.gk_id) : [];
            const result = rows.map(row => ({ ...row, isBookmarked: bookmarkedIds.includes(row.id) }));
            return res.json(result);
        });
    });
});

app.post('/api/gk/bookmark', verifyToken, (req, res) => {
    const { gk_id } = req.body;
    db.run('INSERT INTO bookmarks (user_id, gk_id) VALUES ($1, $2) ON CONFLICT (user_id, gk_id) DO NOTHING', [req.userId, gk_id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        return res.json({ message: 'Bookmarked' });
    });
});

app.delete('/api/gk/bookmark/:gk_id', verifyToken, (req, res) => {
    const { gk_id } = req.params;
    db.run('DELETE FROM bookmarks WHERE user_id = $1 AND gk_id = $2', [req.userId, gk_id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        return res.json({ message: 'Bookmark removed' });
    });
});

app.get('/api/gk/bookmarks', verifyToken, (req, res) => {
    db.all('SELECT g.* FROM gk_points g JOIN bookmarks b ON g.id = b.gk_id WHERE b.user_id = $1', [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        return res.json(rows.map(row => ({...row, isBookmarked: true})));
    });
});

app.get('/api/gk/date/:date', verifyToken, (req, res) => {
    const { date } = req.params;
    db.all('SELECT * FROM gk_points WHERE date = $1', [date], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (rows.length > 0) {
            return db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [req.userId], (err, bookmarks) => {
                if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
                const bookmarkedIds = bookmarks.map(b => b.gk_id);
                const result = rows.map(row => ({ ...row, isBookmarked: bookmarkedIds.includes(row.id) }));
                return res.json(result);
            });
        }
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

app.get('/api/gk/month/:year/:month', verifyToken, (req, res) => {
    const { year, month } = req.params;
    const paddedMonth = month.padStart(2, '0');
    const datePattern = year + '-' + paddedMonth + '-%';
    console.log(`📅 Monthly request: Year=${year}, Month=${paddedMonth}, Pattern=${datePattern}`);
    
    db.all('SELECT * FROM gk_points WHERE date LIKE $1 ORDER BY date DESC', [datePattern], (err, rows) => {
        if (err) {
            console.error('Monthly fetch error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        console.log(`📊 DB entries for ${paddedMonth}: ${rows.length}`);
        
        if (year === '2025') {
            const mockData = getMockMonthlyData2025(paddedMonth);
            console.log(`📊 Mock data entries for ${paddedMonth}: ${mockData.length}`);
            
            if (paddedMonth === '12') {
                // Special handling for December - combine daily and monthly mock data
                const decemberDailyData = getMockDailyDataDecember2025();
                const allDecemberMock = Object.values(decemberDailyData).flat();
                
                // Add unique IDs to mock data
                const mockWithIds = allDecemberMock.map((item, index) => ({
                    ...item,
                    id: `mock_dec_daily_${index}`,
                    source_url: null,
                    isFromMock: true
                }));
                
                const combined = [...mockWithIds, ...rows];
                const unique = combined.filter((item, index, self) => 
                    index === self.findIndex(t => 
                        (t.id === item.id || (t.date === item.date && t.content === item.content))
                    )
                ).sort((a, b) => new Date(b.date) - new Date(a.date));
                
                console.log(`✅ December combined: ${unique.length} total entries`);
                
                // Attach bookmarks only to non-mock items
                db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [req.userId], (err, bookmarks) => {
                    if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
                    const bookmarkedIds = bookmarks.map(b => b.gk_id);
                    const result = unique.map(item => ({
                        ...item,
                        isBookmarked: item.isFromMock ? false : bookmarkedIds.includes(item.id)
                    }));
                    return res.json(result);
                });
                return;
            }
            
            // For other months in 2025
            if (mockData.length > 0) {
                // Add unique IDs to mock data
                const mockWithIds = mockData.map((item, index) => ({
                    ...item,
                    id: `mock_${paddedMonth}_${index}`,
                    source_url: null,
                    isFromMock: true
                }));
                
                console.log(`✅ Returning ${mockWithIds.length} mock entries for month ${paddedMonth}`);
                
                // Combine mock data with any real data
                const combined = [...mockWithIds, ...rows];
                const unique = combined.filter((item, index, self) => 
                    index === self.findIndex(t => 
                        (t.id === item.id || (t.date === item.date && t.content === item.content))
                    )
                ).sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Attach bookmarks only to non-mock items
                db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [req.userId], (err, bookmarks) => {
                    if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
                    const bookmarkedIds = bookmarks.map(b => b.gk_id);
                    const result = unique.map(item => ({
                        ...item,
                        isBookmarked: item.isFromMock ? false : bookmarkedIds.includes(item.id)
                    }));
                    return res.json(result);
                });
                return;
            }
        }
        
        // For non-2025 years or no mock data
        if (rows.length > 0) {
            console.log(`✅ Returning ${rows.length} DB entries for ${paddedMonth}`);
            db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [req.userId], (err, bookmarks) => {
                if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
                const bookmarkedIds = bookmarks.map(b => b.gk_id);
                const result = rows.map(item => ({ ...item, isBookmarked: bookmarkedIds.includes(item.id) }));
                return res.json(result);
            });
        } else {
            console.log(`⚠️ No data found for ${year}-${paddedMonth}`);
            return res.json([]);
        }
    });
});

app.get('/api/gk/yearly/:year', verifyToken, (req, res) => {
    const { year } = req.params;
    const datePattern = year + '-%';
    console.log(`📅 Yearly request: Year=${year}, Pattern=${datePattern}`);
    
    db.all('SELECT * FROM gk_points WHERE date LIKE $1 ORDER BY date DESC', [datePattern], (err, rows) => {
        if (err) {
            console.error('Yearly fetch error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        const mockData = getMockYearlyData(year);
        console.log(`📊 Mock data entries for ${year}: ${mockData.length}, DB entries: ${rows.length}`);
        
        if (mockData.length > 0) {
            // Add unique IDs to mock data
            const mockWithIds = mockData.map((item, index) => ({
                ...item,
                id: `mock_year_${year}_${index}`,
                source_url: null,
                isFromMock: true
            }));
            
            // Combine mock data with database data
            const combined = [...mockWithIds, ...rows];
            const unique = combined.filter((item, index, self) => 
                index === self.findIndex(t => 
                    (t.id === item.id || (t.date === item.date && t.content === item.content))
                )
            ).sort((a, b) => new Date(b.date) - new Date(a.date));
            
            console.log(`✅ Returning ${unique.length} combined entries for year ${year}`);
            
            // Attach bookmarks only to non-mock items
            db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [req.userId], (err, bookmarks) => {
                if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
                const bookmarkedIds = bookmarks.map(b => b.gk_id);
                const result = unique.map(item => ({
                    ...item,
                    isBookmarked: item.isFromMock ? false : bookmarkedIds.includes(item.id)
                }));
                return res.json(result);
            });
            return;
        }
        
        // If no mock data, return DB data
        if (rows.length > 0) {
            console.log(`✅ Returning ${rows.length} DB entries for year ${year}`);
            db.all('SELECT gk_id FROM bookmarks WHERE user_id = $1', [req.userId], (err, bookmarks) => {
                if (err) return res.status(500).json({ message: 'Bookmark fetch failed' });
                const bookmarkedIds = bookmarks.map(b => b.gk_id);
                const result = rows.map(item => ({ ...item, isBookmarked: bookmarkedIds.includes(item.id) }));
                return res.json(result);
            });
        } else {
            console.log(`⚠️ No data found for year ${year}`);
            return res.json([]);
        }
    });
});

app.post('/api/activity', verifyToken, (req, res) => {
    const { type, gk_id } = req.body;
    db.run('INSERT INTO user_activity (user_id, activity_type, gk_id) VALUES ($1, $2, $3)', [req.userId, type, gk_id || null], (err) => {
        if (err) {
            console.error('Failed to log activity:', err);
            return res.status(500).json({ message: 'Failed to log activity' });
        }
        return res.json({ message: 'Activity logged successfully' });
    });
});

app.get('/api/dashboard/summary', verifyToken, (req, res) => {
  const userId = req.userId;
  db.all('SELECT DISTINCT date(created_at) as activity_date FROM user_activity WHERE user_id = $1 ORDER BY activity_date DESC', [userId], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (rows.length > 0) {
        const mostRecent = new Date(rows[0].activity_date);
        mostRecent.setHours(0, 0, 0, 0);
        const diff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
        if (diff <= 1) {
            let checkDate = new Date(mostRecent);
            checkDate.setHours(0, 0, 0, 0);
            for (let i = 0; i < rows.length; i++) {
                const actual = new Date(rows[i].activity_date);
                actual.setHours(0, 0, 0, 0);
                if (actual.getTime() === checkDate.getTime()) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }
      }
      const activeDays = rows.length;
      db.get('SELECT COUNT(*) as totalActivities FROM user_activity WHERE user_id = $1', [userId], (err, totalRow) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          return res.json({ streak, activeDays, totalActivities: totalRow.totalactivities || 0 });
      });
  });
});

app.get('/api/cron/trigger', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('❌ Unauthorized cron attempt');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('✅ Authorized cron job started');
    try {
        await new Promise((resolve, reject) => {
            db.run("DELETE FROM news_archive WHERE published_at < NOW() - INTERVAL '30 days'", function(err) {
                if (err) {
                    console.error('❌ Cleanup error:', err);
                    reject(err);
                } else {
                    console.log(`🧹 Deleted ${this.changes} old articles`);
                    resolve();
                }
            });
        });
        const today = new Date().toISOString().split('T')[0];
        const lastFetch = await new Promise((resolve, reject) => {
            db.get("SELECT fetched_at FROM news_cache WHERE query_key = $1", ['cron-daily-check'], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        if (lastFetch) {
            const lastFetchDate = new Date(lastFetch.fetched_at).toISOString().split('T')[0];
            if (lastFetchDate === today) {
                console.log('⏭️ Already fetched today, skipping');
                return res.json({ message: 'Already updated today', lastFetch: lastFetchDate });
            }
        }
        console.log('📰 Fetching fresh news...');
        const indianUrl = `https://gnews.io/api/v4/top-headlines?country=in&apikey=${GNEWS_API_KEY}&lang=en&max=30`;
        await fetchGNews(indianUrl, 'top-headlines-in');
        await fetchMultipleGlobalNews();
        await new Promise((resolve, reject) => {
            db.run("INSERT INTO news_cache (query_key, data, fetched_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (query_key) DO UPDATE SET data = EXCLUDED.data, fetched_at = CURRENT_TIMESTAMP", ['cron-daily-check', '{}'], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('✅ Cron job completed successfully');
        return res.json({ message: 'News updated successfully', timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('❌ Cron job failed:', error);
        return res.status(500).json({ message: 'Cron job failed', error: error.message });
    }
});

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log('✅ Server running on port ' + PORT);
    console.log('✅ Mock data loaded from separate files');
    console.log('⏰ Daily news handled via GitHub Actions cron');
    console.log('✅ Balanced news fetching enabled (Indian + Global)');
    console.log('📅 Current date:', new Date().toISOString().split('T')[0]);
    console.log('🐘 PostgreSQL Database Connected');
});