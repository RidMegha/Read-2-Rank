import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Save, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Settings = () => {
    const { user } = useAuth();
    const [passData, setPassData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Individual state for toggling visibility of each field
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        
        if (passData.newPassword !== passData.confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/password', 
                { currentPassword: passData.currentPassword, newPassword: passData.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ text: 'Password updated successfully!', type: 'success' });
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Failed to update password', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8 p-4"
        >
            {/* Header Section */}
            <div className="relative">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                    Account Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your security and preferences.</p>
            </div>
            
            {/* Main Security Card */}
            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 border border-gray-100 dark:border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <ShieldCheck size={120} />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Security Credentials
                </h2>

                <AnimatePresence mode="wait">
                    {message.text && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 mb-6 rounded-xl border flex items-center ${
                                message.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
                                : 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg relative z-10">
                    {[
                        { label: 'Current Password', name: 'currentPassword' },
                        { label: 'New Password', name: 'newPassword' },
                        { label: 'Confirm New Password', name: 'confirmPassword' }
                    ].map((field) => (
                        <div key={field.name} className="group">
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 group-focus-within:text-blue-500 transition-colors">
                                {field.label}
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type={showPasswords[field.name] ? "text" : "password"}
                                    name={field.name}
                                    required
                                    value={passData[field.name]}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility(field.name)}
                                    className="absolute right-3 p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg focus:outline-none"
                                    aria-label={showPasswords[field.name] ? "Hide password" : "Show password"}
                                >
                                    {showPasswords[field.name] ? (
                                        <EyeOff className="w-5 h-5 transition-transform hover:scale-110" />
                                    ) : (
                                        <Eye className="w-5 h-5 transition-transform hover:scale-110" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            <span>{loading ? 'Processing...' : 'Save New Password'}</span>
                        </motion.button>
                    </div>
                </form>
            </div>
            
            {/* Disabled Section / Coming Soon */}
            <div className="bg-gray-50/50 dark:bg-slate-900/30 rounded-3xl p-8 border border-dashed border-gray-300 dark:border-gray-700 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-1 flex items-center">
                            Display Settings
                            <span className="ml-3 text-xs font-medium px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full uppercase tracking-wider">
                                Coming Soon
                            </span>
                        </h2>
                        <p className="text-gray-400 dark:text-gray-600 text-sm">Personalize your workspace layout and density.</p>
                    </div>
                    <div className="flex items-center space-x-4 grayscale opacity-40">
                         <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative shadow-inner">
                            <div className="w-4 h-4 bg-white dark:bg-gray-400 rounded-full absolute top-1 left-1"></div>
                         </div>
                         <span className="font-medium text-gray-400">Compact Mode</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;