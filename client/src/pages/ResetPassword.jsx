import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
import axios from '../api/axios';


// const API = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link');
            setVerifying(false);
            return;
        }

        // Verify token
        // axios.get(`/api/auth/verify-reset-token/${token}`)
        // axios.get(`http://localhost:5000/api/auth/verify-reset-token/${token}`)
        axios.get(`/api/auth/verify-reset-token/${token}`)
            .then(() => {
                setTokenValid(true);
                setVerifying(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Invalid or expired reset link');
                setVerifying(false);
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`/api/auth/reset-password`, {
                token,
                newPassword
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f1d]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f1d] px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Reset Link</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 font-bold">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f1d] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
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
                        <Lock className="h-7 w-7 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Reset Password</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">Enter your new password</p>
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

                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl flex items-center gap-3"
                        >
                            <CheckCircle className="h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Password reset successfully!</p>
                                <p className="text-xs mt-1">Redirecting to login...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
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

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="relative w-full group flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Reset Password'
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;