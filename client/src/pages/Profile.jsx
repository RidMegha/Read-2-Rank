import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save, Edit2, X, Briefcase, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        exam_type: user.exam_type
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/profile', 
                { name: formData.name, exam_type: formData.exam_type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setIsEditing(false);
            // In a real app, update context here. For now, we simulate the refresh.
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setMessage({ text: 'Failed to update profile.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto space-y-6 p-4"
        >
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                User Profile
            </h1>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10">
                {/* Banner Section */}
                <div className="h-40 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                    <div className="absolute -bottom-14 left-8">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="h-28 w-28 rounded-3xl p-1 bg-white dark:bg-slate-900 shadow-2xl relative z-10"
                        >
                            <div className="h-full w-full rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-4xl font-black text-indigo-600 dark:text-indigo-400 border border-gray-100 dark:border-slate-600">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                <div className="pt-16 px-8 pb-8">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{user.email}</span>
                            </div>
                        </div>
                        
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
                                isEditing 
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 hover:bg-rose-100' 
                                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 hover:bg-indigo-100'
                            }`}
                        >
                            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {message.text && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={`p-4 mb-8 rounded-xl border flex items-center gap-3 ${
                                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                                }`}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    disabled={!isEditing}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all duration-300 ${
                                        isEditing 
                                        ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-900 ring-4 ring-indigo-500/5 focus:border-indigo-500' 
                                        : 'bg-gray-50 dark:bg-slate-800/50 border-transparent cursor-default'
                                    } outline-none font-medium text-gray-800 dark:text-gray-200`}
                                />
                            </div>
                        </div>

                        {/* Exam Select */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Target Exam</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    name="exam_type"
                                    disabled={!isEditing}
                                    value={formData.exam_type}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border appearance-none transition-all duration-300 ${
                                        isEditing 
                                        ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-900 ring-4 ring-indigo-500/5 focus:border-indigo-500' 
                                        : 'bg-gray-50 dark:bg-slate-800/50 border-transparent cursor-default'
                                    } outline-none font-medium text-gray-800 dark:text-gray-200`}
                                >
                                    <option value="UPSC">UPSC Civil Services</option>
                                    <option value="SSC">SSC CGL / CHSL</option>
                                    <option value="Banking">Banking Exams</option>
                                    <option value="State PSC">State PSC</option>
                                </select>
                            </div>
                        </div>

                        {/* Save Button Container */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="md:col-span-2 flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800 mt-4"
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-3 transition-all disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                        <span>{loading ? 'Saving Profile...' : 'Save Profile Details'}</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;