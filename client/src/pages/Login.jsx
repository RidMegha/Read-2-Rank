import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Link } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f1d] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -right-10 w-80 h-80 bg-blue-400 dark:bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 -left-10 w-80 h-80 bg-indigo-400 dark:bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md p-8 space-y-8 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 relative z-10"
            >
                <div className="text-center">
                    <motion.div 
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="mx-auto h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6"
                    >
                        <Sparkles className="h-7 w-7 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Welcome Back</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">Access your GK learning dashboard</p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-2xl flex items-center gap-3"
                        >
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        {/* Email Input */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-2 group-focus-within:text-blue-500 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-2 group-focus-within:text-blue-500 transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center group/eye" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 group-hover/eye:text-blue-500 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 group-hover/eye:text-blue-500 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                                >
                                Forgot password?
                            </Link>

                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="relative w-full group flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all overflow-hidden"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center">
                                Sign In <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </motion.button>
                </form>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                        <span className="px-4 bg-white dark:bg-slate-900 text-gray-400">New around here?</span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Ready to start your journey?{' '}
                        <Link to="/signup" className="font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline underline-offset-4 decoration-indigo-200 dark:decoration-indigo-800">
                            Create an Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;