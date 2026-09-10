import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, LogOut, LayoutDashboard, Map as MapIcon, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="site-nav fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="brand-mark">
                            <Zap className="text-[#182006] w-5 h-5 fill-current" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-white">Volt<span className="text-primary-300">Hub</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-7">
                        <Link to="/map" className="nav-link">
                            <MapIcon size={16} /> Discover
                        </Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="nav-link">
                                <ShieldCheck size={18} /> Admin
                            </Link>
                        )}
                        {user?.role === 'owner' && (
                            <Link to="/owner" className="nav-link">
                                <LayoutDashboard size={18} /> Owner Panel
                            </Link>
                        )}
                        {user?.role === 'user' && (
                            <Link to="/dashboard" className="nav-link">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 nav-user">
                                    <User size={16} className="text-primary-400" />
                                    <span className="text-sm font-medium text-slate-300">{user.name}</span>
                                </div>
                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="p-2 text-slate-400 hover:text-primary-300 transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm">Log in</Link>
                                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
