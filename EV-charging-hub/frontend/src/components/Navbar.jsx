import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, LogOut, LayoutDashboard, Map as MapIcon, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Zap className="text-white w-6 h-6 fill-current" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            VoltHub
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/map" className="text-slate-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                            <MapIcon size={18} /> Discovery
                        </Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-slate-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                                <ShieldCheck size={18} /> Admin
                            </Link>
                        )}
                        {user?.role === 'owner' && (
                            <Link to="/owner" className="text-slate-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                                <LayoutDashboard size={18} /> Owner Panel
                            </Link>
                        )}
                        {user?.role === 'user' && (
                            <Link to="/dashboard" className="text-slate-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
                                    <User size={16} className="text-primary-400" />
                                    <span className="text-sm font-medium text-slate-300">{user.name}</span>
                                </div>
                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2">Login</Link>
                                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
