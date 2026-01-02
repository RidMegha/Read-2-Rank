import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Newspaper, ExternalLink, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Homepage = () => {
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [globalNews, setGlobalNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('indian');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const indianRes = await axios.get('http://localhost:5000/api/news/indian');
                setNews(indianRes.data.articles);
                
                const globalRes = await axios.get('http://localhost:5000/api/news/global');
                setGlobalNews(globalRes.data.articles);
            } catch (error) {
                console.error("Error fetching news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const NewsCard = ({ article, index }) => (
        <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                delay: index * 0.08, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                y: -8, 
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
            }}
            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full group relative backdrop-blur-sm"
            style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
        >
            {/* Gradient overlay for hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-3xl pointer-events-none"></div>
            
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))',
                    filter: 'blur(20px)',
                    transform: 'scale(1.02)',
                    zIndex: -1
                }}
            ></div>

            {article.image && (
                <div className="h-56 overflow-hidden relative">
                    <motion.img 
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover" 
                    />
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-500"></div>
                    
                    {/* Source badge */}
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.08 + 0.3 }}
                        className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-blue-600 dark:text-blue-400 font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-blue-200/50 dark:border-blue-500/30 group-hover:scale-110 transition-transform duration-300"
                    >
                        {article.source.name}
                    </motion.div>

                    {/* Trending badge */}
                    <motion.div 
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.08 + 0.4 }}
                        className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1"
                    >
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending</span>
                    </motion.div>
                </div>
            )}
            
            <div className="p-7 flex flex-col flex-grow relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                    {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {article.description}
                </p>
                
                <div className="mt-auto space-y-4">
                    {/* Divider with gradient */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 px-3 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 group-hover:shadow-md transition-shadow">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <Link 
                            to={`/news/read?url=${encodeURIComponent(article.url)}`}
                            className="flex items-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-5 py-2.5 rounded-xl transition-all group/link shadow-lg hover:shadow-xl hover:scale-105 transform duration-300"
                        >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover/link:translate-x-1.5 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 shadow-lg"
                ></motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {!user && (
                <motion.div 
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden"
                >
                    {/* Animated background elements */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                    ></motion.div>
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl"
                    ></motion.div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
                        <div>
                            <h2 className="text-3xl font-extrabold mb-3 flex items-center">
                                Unlock Your Potential 
                                <motion.span
                                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                    className="inline-block ml-2"
                                >
                                    🚀
                                </motion.span>
                            </h2>
                            <p className="text-blue-50 text-lg">Sign up now to access exclusive GK features, revision tools, and bookmarks!</p>
                        </div>
                        <Link 
                            to="/signup" 
                            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-2xl hover:scale-110 hover:shadow-white/20 transform duration-300 whitespace-nowrap"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </motion.div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4"
                >
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                        <Newspaper className="w-7 h-7" />
                    </div>
                    <h1 className="
                            text-5xl font-extrabold leading-[1.2] pb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 ">
                            Daily News Feed
                    </h1>

                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                    <button 
                        onClick={() => setActiveTab('indian')}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                            activeTab === 'indian' 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                    >
                        {activeTab === 'indian' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center">
                            🇮🇳 Indian News
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('global')}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                            activeTab === 'global' 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                    >
                        {activeTab === 'global' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center">
                            🌍 Global News
                        </span>
                    </button>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {(activeTab === 'indian' ? news : globalNews).map((article, index) => (
                    <NewsCard key={index} article={article} index={index} />
                ))}
            </motion.div>
        </div>
    );
};

export default Homepage;