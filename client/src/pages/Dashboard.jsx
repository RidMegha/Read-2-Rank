import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

import { useAuth } from '../context/AuthContext';
import { Award, Bookmark, TrendingUp, Calendar, Zap, Activity, Trash2, BookmarkCheck } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        streak: 0,
        accuracy: 0,
        activeDays: 0,
        totalAttempts: 0,
        correctAttempts: 0
    });

    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchDashboard = async () => {
            try {
                const [statsRes, bookmarksRes] = await Promise.all([
                    axios.get(`/api/dashboard/summary`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`/api/gk/bookmarks`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setStats(statsRes.data);
                setBookmarks(bookmarksRes.data);
            } catch (err) {
                console.error('Dashboard fetch failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const removeBookmark = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/gk/bookmark/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookmarks(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            console.error('Failed to remove bookmark', err);
        }
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

    const statCards = [
        { 
            label: 'Current Streak', 
            value: `${stats.streak} Days`, 
            icon: Zap,
            gradient: 'from-amber-400 via-orange-500 to-red-500',
            iconBg: 'from-amber-500 to-orange-600',
            cardBg: 'from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950',
            borderGlow: 'hover:shadow-amber-500/30 dark:hover:shadow-amber-400/20'
        },
        { 
            label: 'Active Days', 
            value: stats.activeDays, 
            icon: Activity,
            gradient: 'from-blue-400 via-cyan-500 to-teal-500',
            iconBg: 'from-blue-500 to-cyan-600',
            cardBg: 'from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950',
            borderGlow: 'hover:shadow-blue-500/30 dark:hover:shadow-blue-400/20'
        },
        { 
            label: 'Bookmarks', 
            value: bookmarks.length, 
            icon: Bookmark,
            gradient: 'from-purple-400 via-pink-500 to-rose-500',
            iconBg: 'from-purple-500 to-pink-600',
            cardBg: 'from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950',
            borderGlow: 'hover:shadow-purple-500/30 dark:hover:shadow-purple-400/20'
        },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-3 animate-fade-in drop-shadow-lg">
                        Welcome back, {user?.name || 'Aspirant'}! 👋
                    </h1>
                    <p className="text-blue-100 dark:text-blue-200 text-lg font-medium">
                        {user?.exam_type ? `Preparing for ${user.exam_type}` : 'Your learning journey continues'}
                    </p>
                </div>
                
                {/* Decorative corner element */}
                <div className="absolute top-4 right-4 w-24 h-24 border-4 border-white/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden bg-gradient-to-br ${stat.cardBg} p-6 rounded-2xl shadow-lg ${stat.borderGlow} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-opacity-50 hover:border-gray-200 dark:hover:border-gray-600 group cursor-pointer`}
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                            <stat.icon className="w-7 h-7 text-white" />
                        </div>
                        
                        <h3 className="text-4xl font-black text-gray-800 dark:text-gray-100 mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                            {stat.value}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Bookmarks Section */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-xl border-2 border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
                
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <BookmarkCheck className="w-7 h-7 text-white" />
                        </div>
                        Your Bookmarks
                        <span className="text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full shadow-md">
                            {bookmarks.length}
                        </span>
                    </h2>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="relative inline-block">
                            <Bookmark className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
                            <div className="absolute inset-0 animate-ping opacity-20">
                                <Bookmark className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No bookmarks yet. Start saving important GK points!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {bookmarks.map((item, index) => (
                            <div
                                key={item.id}
                                className="group relative p-6 bg-white dark:bg-gray-700/50 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl hover:-translate-y-1"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Priority indicator line */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${
                                    item.priority === 'High' ? 'bg-gradient-to-b from-red-500 to-red-600' : 
                                    item.priority === 'Medium' ? 'bg-gradient-to-b from-yellow-500 to-amber-600' : 
                                    'bg-gradient-to-b from-green-500 to-emerald-600'
                                }`} />
                                
                                <div className="flex items-start gap-4 pl-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-3 h-3 rounded-full shadow-md animate-pulse ${
                                            item.priority === 'High' ? 'bg-red-500 shadow-red-500/50' : 
                                            item.priority === 'Medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 
                                            'bg-green-500 shadow-green-500/50'
                                        }`} />
                                    </div>
                                    
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                                                item.priority === 'High' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-300' : 
                                                item.priority === 'Medium' ? 'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 dark:from-yellow-900/40 dark:to-amber-800/40 dark:text-yellow-300' : 
                                                'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 dark:from-green-900/40 dark:to-emerald-800/40 dark:text-green-300'
                                            }`}>
                                                {item.priority}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 px-3 py-1 rounded-full shadow-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                                            {item.content}
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={() => removeBookmark(item.id)}
                                        className="flex-shrink-0 p-2.5 text-red-500 hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md hover:shadow-lg"
                                        title="Remove bookmark"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions - FIXED NAVIGATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                    onClick={() => navigate('/gk/today')}
                    className="group relative overflow-hidden block p-8 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 rounded-2xl text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl mb-2">Today's GK</h3>
                        <p className="text-blue-100 text-sm font-medium">View latest updates</p>
                    </div>
                </div>
                
                <div 
                    onClick={() => navigate('/')}
                    className="group relative overflow-hidden block p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 rounded-2xl text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <Activity className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl mb-2">Daily News</h3>
                        <p className="text-green-100 text-sm font-medium">Read current affairs</p>
                    </div>
                </div>
                
                <div 
                    onClick={() => navigate('/revision')}
                    className="group relative overflow-hidden block p-8 bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 hover:from-purple-600 hover:via-violet-700 hover:to-fuchsia-700 rounded-2xl text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <Award className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl mb-2">GK Archive</h3>
                        <p className="text-purple-100 text-sm font-medium">Browse past events</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;