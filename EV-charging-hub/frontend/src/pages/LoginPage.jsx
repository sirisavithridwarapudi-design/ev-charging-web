import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password, isAdmin);
            navigate(isAdmin ? '/admin' : '/map');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[128px]"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Enter your credentials to access VoltHub</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3">
                        <ShieldAlert size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={20} />
                            <input
                                type="email"
                                required
                                className="input-field input-with-icon w-full"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={20} />
                            <input
                                type="password"
                                required
                                className="input-field input-with-icon w-full"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="admin-toggle"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor="admin-toggle" className="text-sm text-slate-400 cursor-pointer">
                            Login as Administrator
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'} <LogIn size={20} />
                    </button>
                </form>

                {!isAdmin && (
                    <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
                        <p className="text-slate-500 text-sm">
                            Don't have an account? {' '}
                            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;
