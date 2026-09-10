import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ShieldAlert, Building2 } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/map');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-slate-400">Join the smart charging revolution</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3">
                        <ShieldAlert size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-6">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'user' })}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${formData.role === 'user' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <User size={16} /> EV Driver
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'owner' })}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${formData.role === 'owner' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Building2 size={16} /> Station Owner
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={20} />
                            <input
                                type="text"
                                required
                                className="input-field input-with-icon w-full"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={20} />
                            <input
                                type="email"
                                required
                                className="input-field input-with-icon w-full"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg mt-4"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'} <UserPlus size={20} />
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
                    <p className="text-slate-500 text-sm">
                        Already have an account? {' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
