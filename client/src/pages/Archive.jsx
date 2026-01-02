import React, { useState, useEffect } from 'react';
 import axios from 'axios';
// import axios from '../api/axios';

import { Calendar, ExternalLink, Archive as ArchiveIcon, Clock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Archive = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({ 'Today': true }); // Today is expanded by default

    useEffect(() => {
        const fetchArchive = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/news/archive');
                setNews(res.data);
            } catch (error) {
                console.error("Error fetching archive", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArchive();
    }, []);

    // Toggle section expansion
    const toggleSection = (title) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Enhanced helper to group news by date with more granular categories
    const groupNewsByDate = (newsList) => {
        const groups = {
            'Today': [],
            'Yesterday': [],
            'Last 3 Days': [],
            'Last 7 Days': [],
            'Last 10 Days': [],
            'Last 20 Days': [],
            'Last 30 Days': []
        };

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        
        const twentyDaysAgo = new Date(today);
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
        
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        newsList.forEach(item => {
            const date = new Date(item.published_at);
            // Only include news from last 30 days
            if (date < thirtyDaysAgo) {
                return; // Skip news older than 30 days
            }
            
            if (date.toDateString() === today.toDateString()) {
                groups['Today'].push(item);
            } else if (date.toDateString() === yesterday.toDateString()) {
                groups['Yesterday'].push(item);
            } else if (date > threeDaysAgo) {
                groups['Last 3 Days'].push(item);
            } else if (date > sevenDaysAgo) {
                groups['Last 7 Days'].push(item);
            } else if (date > tenDaysAgo) {
                groups['Last 10 Days'].push(item);
            } else if (date > twentyDaysAgo) {
                groups['Last 20 Days'].push(item);
            } else if (date > thirtyDaysAgo) {
                groups['Last 30 Days'].push(item);
            }
        });

        // Filter out empty groups and return with metadata
        return Object.entries(groups)
            .filter(([_, items]) => items.length > 0)
            .map(([title, items]) => ({
                title,
                items,
                count: items.length
            }));
    };

    const groupedNews = groupNewsByDate(news);

    // Color schemes for different time periods
    const getGroupColor = (title) => {
        const colors = {
            'Today': { 
                gradient: 'from-blue-500 to-cyan-500', 
                badge: 'from-blue-500 to-cyan-500', 
                bgLight: 'bg-blue-50 dark:bg-blue-950/30',
                border: 'border-blue-300 dark:border-blue-700',
                text: 'text-blue-700 dark:text-blue-300',
                icon: 'text-blue-600 dark:text-blue-400'
            },
            'Yesterday': { 
                gradient: 'from-purple-500 to-pink-500', 
                badge: 'from-purple-500 to-pink-500', 
                bgLight: 'bg-purple-50 dark:bg-purple-950/30',
                border: 'border-purple-300 dark:border-purple-700',
                text: 'text-purple-700 dark:text-purple-300',
                icon: 'text-purple-600 dark:text-purple-400'
            },
            'Last 3 Days': { 
                gradient: 'from-green-500 to-emerald-500', 
                badge: 'from-green-500 to-emerald-500', 
                bgLight: 'bg-green-50 dark:bg-green-950/30',
                border: 'border-green-300 dark:border-green-700',
                text: 'text-green-700 dark:text-green-300',
                icon: 'text-green-600 dark:text-green-400'
            },
            'Last 7 Days': { 
                gradient: 'from-orange-500 to-red-500', 
                badge: 'from-orange-500 to-red-500', 
                bgLight: 'bg-orange-50 dark:bg-orange-950/30',
                border: 'border-orange-300 dark:border-orange-700',
                text: 'text-orange-700 dark:text-orange-300',
                icon: 'text-orange-600 dark:text-orange-400'
            },
            'Last 10 Days': { 
                gradient: 'from-indigo-500 to-blue-500', 
                badge: 'from-indigo-500 to-blue-500', 
                bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
                border: 'border-indigo-300 dark:border-indigo-700',
                text: 'text-indigo-700 dark:text-indigo-300',
                icon: 'text-indigo-600 dark:text-indigo-400'
            },
            'Last 20 Days': { 
                gradient: 'from-teal-500 to-cyan-500', 
                badge: 'from-teal-500 to-cyan-500', 
                bgLight: 'bg-teal-50 dark:bg-teal-950/30',
                border: 'border-teal-300 dark:border-teal-700',
                text: 'text-teal-700 dark:text-teal-300',
                icon: 'text-teal-600 dark:text-teal-400'
            },
            'Last 30 Days': { 
                gradient: 'from-violet-500 to-purple-500', 
                badge: 'from-violet-500 to-purple-500', 
                bgLight: 'bg-violet-50 dark:bg-violet-950/30',
                border: 'border-violet-300 dark:border-violet-700',
                text: 'text-violet-700 dark:text-violet-300',
                icon: 'text-violet-600 dark:text-violet-400'
            }
        };
        return colors[title] || colors['Last 30 Days'];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
                    <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-400 dark:border-blue-300 opacity-20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section - Different Style */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-orange-500 via-red-500 to-pink-500"></div>
                
                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Icon Section */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                <ArchiveIcon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-grow text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 px-4 py-2 rounded-full text-sm font-bold text-orange-700 dark:text-orange-300 mb-4">
                                <Sparkles className="w-4 h-4" />
                                30-Day Archive
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                                News Archive
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                                Browse important news from the past 30 days. Articles are automatically organized by date and removed after 30 days.
                            </p>
                        </div>

                        {/* Stats Section */}
                        <div className="flex flex-col gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-4 rounded-2xl shadow-lg text-white text-center min-w-[140px]">
                                <div className="text-3xl font-black">{news.length}</div>
                                <div className="text-xs font-semibold opacity-90">Total Articles</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 px-6 py-4 rounded-2xl shadow-lg text-white text-center min-w-[140px]">
                                <div className="text-3xl font-black">{groupedNews.length}</div>
                                <div className="text-xs font-semibold opacity-90">Time Periods</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {groupedNews.length === 0 ? (
                <div className="relative overflow-hidden text-center py-20 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-800 dark:to-orange-950 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-lg">
                    <div className="relative z-10">
                        <div className="inline-block mb-6">
                            <div className="relative">
                                <ArchiveIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 animate-pulse" />
                                <div className="absolute inset-0 animate-ping opacity-20">
                                    <ArchiveIcon className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                                </div>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">No archived news found.</p>
                        <p className="text-gray-400 dark:text-gray-500 mt-2 text-lg">Check back tomorrow for updates!</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedNews.map(({ title, items, count }, groupIndex) => {
                        const colors = getGroupColor(title);
                        const isExpanded = expandedSections[title];
                        
                        return (
                            <div key={title} className="space-y-4">
                                {/* Collapsible Section Header */}
                                <button
                                    onClick={() => toggleSection(title)}
                                    className={`w-full group relative overflow-hidden ${colors.bgLight} hover:shadow-lg transition-all duration-300 rounded-2xl border-2 ${colors.border} ${isExpanded ? 'shadow-md' : ''}`}
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    
                                    <div className="relative z-10 flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            {/* Gradient icon background */}
                                            <div className={`p-3 bg-gradient-to-br ${colors.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            
                                            <div className="text-left">
                                                <h2 className={`text-2xl md:text-3xl font-bold ${colors.text} flex items-center gap-3`}>
                                                    {title}
                                                </h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {count} {count === 1 ? 'article' : 'articles'} available
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* Count badge */}
                                            <div className={`px-4 py-2 bg-gradient-to-br ${colors.gradient} text-white rounded-full font-bold text-lg shadow-md`}>
                                                {count}
                                            </div>
                                            
                                            {/* Expand/Collapse icon */}
                                            <div className={`p-2 rounded-full ${colors.bgLight} ${colors.border} border-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                <ChevronDown className={`w-6 h-6 ${colors.icon}`} />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                
                                {/* Collapsible News Grid */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                                                {items.map((article, index) => (
                                                    <motion.div 
                                                        key={article.id || index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                                        className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 flex flex-col h-full hover:-translate-y-3"
                                                    >
                                                        {/* Top gradient accent */}
                                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`}></div>
                                                        
                                                        {/* Shine effect */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-blue-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10"></div>
                                                        
                                                        {article.image_url && (
                                                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-3xl">
                                                                <motion.img 
                                                                    whileHover={{ scale: 1.15, rotate: 2 }}
                                                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                                                    src={article.image_url} 
                                                                    alt={article.title} 
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => e.target.style.display = 'none'} 
                                                                />
                                                                {/* Enhanced overlay gradient */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                                                
                                                                {/* Source badge with enhanced styling */}
                                                                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 backdrop-blur-md text-blue-600 dark:text-blue-400 font-bold text-xs px-4 py-2 rounded-xl shadow-xl border-2 border-blue-100 dark:border-blue-900 group-hover:scale-105 transition-transform">
                                                                    {article.source_name}
                                                                </div>
                                                                
                                                                {/* Date badge with icon */}
                                                                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                </div>

                                                                {/* Decorative corner gradient */}
                                                                <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-20 rounded-br-full blur-2xl`}></div>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="p-6 flex flex-col flex-grow relative z-10 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-transparent">
                                                            {/* Title with enhanced styling */}
                                                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-400 transition-all duration-300">
                                                                {article.title}
                                                            </h3>
                                                            
                                                            {/* Description */}
                                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed font-medium">
                                                                {article.description}
                                                            </p>
                                                            
                                                            {/* Enhanced Footer */}
                                                            <div className="mt-auto flex justify-between items-center pt-5 border-t-2 border-gray-200 dark:border-gray-700">
                                                                {/* Category badge with gradient */}
                                                                <span className={`text-xs font-bold px-4 py-2 rounded-xl shadow-md border-2 ${
                                                                    article.category === 'Global' 
                                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300 dark:border-purple-700' :
                                                                    article.category === 'Indian' 
                                                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300 dark:border-red-700' :
                                                                    'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-300 dark:border-gray-600'
                                                                }`}>
                                                                    {article.category || 'General'}
                                                                </span>
                                                                
                                                                {/* Read button with enhanced styling */}
                                                                <Link 
                                                                    to={`/news/read?url=${encodeURIComponent(article.url)}`}
                                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group/link border-2 border-blue-400 dark:border-blue-600"
                                                                >
                                                                    <span>Read</span>
                                                                    <ExternalLink className="w-4 h-4 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                                                </Link>
                                                            </div>
                                                        </div>

                                                        {/* Enhanced corner decoration with gradient */}
                                                        <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${colors.gradient} opacity-5 rounded-tl-[100px] group-hover:scale-150 group-hover:opacity-10 transition-all duration-500`}></div>
                                                        
                                                        {/* Side accent line */}
                                                        <div className={`absolute right-0 top-20 bottom-20 w-1 bg-gradient-to-b ${colors.gradient} opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer Info */}
            {groupedNews.length > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-700 dark:via-red-800 dark:to-pink-800 rounded-2xl p-8 shadow-xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-center text-white space-y-3">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <ArchiveIcon className="w-6 h-6" />
                            <p className="text-2xl font-bold">Archive Policy</p>
                        </div>
                        <p className="text-lg">
                            📰 Currently storing <span className="text-3xl font-bold px-2">{news.length}</span> important articles
                        </p>
                        <p className="text-sm text-orange-100 mt-2">
                            ⏰ Articles are automatically removed after 30 days to keep the archive fresh and relevant
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Archive;