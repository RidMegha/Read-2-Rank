import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, User, LogOut, Menu, X, BookOpen, Settings, Sparkles, ChevronDown, Zap, Crown } from 'lucide-react';

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // FIXED: Robust click-outside logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close all menus on navigation
    useEffect(() => {
        setIsOpen(false);
        setProfileOpen(false);
    }, [location]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

    // FIXED: Use functional state update and ensure event propagation is stopped correctly
    const toggleProfile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setProfileOpen(prev => !prev);
    };

    return (
        <nav className="bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-950 backdrop-blur-3xl sticky top-0 z-[100] border-b-2 border-gray-200/60 dark:border-purple-500/40 shadow-2xl dark:shadow-purple-900/40 transition-all duration-500 relative overflow-visible group">
            {/* Background Layers */}
            <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-purple-900/20 to-pink-900/10 animate-pulse pointer-events-none"></div>
            
            {/* Top Glow Line */}
            <div className="relative h-1 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-center h-26">
                    {/* Logo Section */}
                    <div className="flex items-center -ml-20 lg:-ml-15">
                        <Link to="/" className="flex items-center gap-3 min-w-max group/logo relative">
                            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-[3px] rounded-2xl group-hover/logo:scale-110 group-hover/logo:rotate-6 transition-all duration-500 shadow-2xl">
                                <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-purple-950 p-3.5 rounded-[14px]">
                                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-purple-400 relative z-10" />
                                </div>
                            </div>
                            <div className="ml-3 hidden sm:block">
                                <span className="text-2xl font-black tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                                    READ-2-RANK
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-7 ml-10 lg:ml-14">
                        {[
                            { name: 'Home', path: '/', icon: '🏠' },
                            { name: 'Archive', path: '/archive', icon: '📚' },
                            { name: 'Today\'s GK', path: '/gk/today', auth: true, icon: '🌍' },
                            { name: 'Revision Hub', path: '/revision', icon: '📝' },
                            { name: 'About', path: '/about', icon: 'ℹ️' },
                            { name: 'Dashboard', path: '/dashboard', auth: true, icon: '📊' },
                        ].map((link) => (
                            (!link.auth || user) && (
                                <NavLink 
                                    key={link.name}
                                    to={link.path} 
                                    className={({ isActive }) => `
                                        relative px-5 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-300 group/link
                                        ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400'}
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg animate-pulse"></div>}
                                            <span className="relative z-10 flex items-center gap-2">
                                                <span>{link.icon}</span>
                                                <span>{link.name}</span>
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            )
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={toggleTheme} 
                            className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:scale-110 transition-all border-2 border-gray-300 dark:border-purple-500/40"
                        >
                            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    type="button"
                                    onClick={toggleProfile}
                                    className={`flex items-center space-x-3 pl-2 pr-4 py-2 rounded-2xl border-2 transition-all duration-500 ${
                                        profileOpen 
                                        ? 'border-blue-600 dark:border-purple-500 bg-white dark:bg-gray-800' 
                                        : 'border-gray-200 dark:border-purple-500/40 bg-white dark:bg-gray-800 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-pink-600 p-[2px]">
                                        <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center font-black text-blue-600">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-gray-700 dark:text-gray-200 hidden lg:inline">{user.name.split(' ')[0]}</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu - FIXED z-index and visibility */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-purple-500/50 overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-xl font-black text-blue-600 shadow-xl">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[16px] font-black text-white truncate">{user.name}</p>
                                                    <p className="text-[13px] text-blue-100 truncate mt-0.5">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3">
                                            <Link to="/profile" className="flex items-center px-5 py-4 rounded-2xl text-[15px] font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-purple-900/40 transition-all">
                                                <User className="w-5.5 h-5.5 mr-4 text-blue-500" /> Profile 
                                            </Link>
                                            <Link to="/settings" className="flex items-center px-5 py-4 rounded-2xl text-[15px] font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-purple-900/40 transition-all">
                                                <Settings className="w-5.5 h-5.5 mr-4 text-purple-500" />Settings
                                            </Link>
                                            <div className="my-2 h-px bg-gray-100 dark:bg-gray-800"></div>
                                            <button onClick={handleLogout} className="flex w-full items-center px-5 py-4 rounded-2xl text-[15px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                                <LogOut className="w-5.5 h-5.5 mr-4" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black shadow-xl">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden px-6 pb-6 pt-4 space-y-3 bg-white/90 dark:bg-gray-950/95 backdrop-blur-2xl border-t border-gray-200 dark:border-purple-500/30">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Archive', path: '/archive' , auth: true},
                        { name: 'Today\'s GK', path: '/gk/today', auth: true },
                        { name: 'Revision Hub', path: '/revision', auth: true },
                        { name: 'About', path: '/about' },
                        { name: 'Dashboard', path: '/dashboard', auth: true },
                    ].map(
                        (link) =>
                            (!link.auth || user) && (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-5 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all"
                                >
                                    {link.name}
                                </NavLink>
                            )
                    )}
                    {user && (
                         <button onClick={handleLogout} className="w-full text-left block px-5 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                            Logout
                         </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;