import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        exam_type: 'UPSC',
        terms: false
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const getPasswordStrength = (pass) => {
        if (!pass) return { strength: 0, color: 'bg-gray-200', label: 'Very Weak' };
        if (pass.length < 6) return { strength: 30, color: 'bg-rose-500', label: 'Weak' };
        if (pass.length < 8) return { strength: 60, color: 'bg-amber-500', label: 'Medium' };
        return { strength: 100, color: 'bg-emerald-500', label: 'Strong' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (!formData.terms) {
            return setError('You must agree to the Terms & Conditions');
        }
        if (formData.password.length < 8) {
            return setError('Password must be at least 8 characters long');
        }

        setLoading(true);
        try {
            await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                exam_type: formData.exam_type
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f1d] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 relative z-10"
            >
                <div className="text-center">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto h-12 w-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4"
                    >
                        <BookOpen className="h-6 w-6 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Join our community of achievers
                    </p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Alex Thompson"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="alex@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                                </button>
                            </div>
                            {/* Animated Strength Bar */}
                            {formData.password && (
                                <div className="mt-3 px-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Security</span>
                                        <span className={`text-[10px] font-bold uppercase ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${passwordStrength.strength}%` }}
                                            className={`h-full ${passwordStrength.color} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Exam Type */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-1">Target Exam</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    name="exam_type"
                                    value={formData.exam_type}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
                                >
                                    <option value="UPSC">UPSC</option>
                                    <option value="SSC">SSC</option>
                                    <option value="Banking">Banking</option>
                                    <option value="State PSC">State PSC</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center px-1">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                            I accept the <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
                        </label>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="flex items-center">
                                Create Account <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </motion.button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;