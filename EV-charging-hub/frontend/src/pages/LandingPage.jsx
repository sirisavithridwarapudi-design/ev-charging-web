import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Cpu, Shield, ArrowRight, BarChart3 } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen pt-16 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] -z-10"></div>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 pt-20 pb-32 sm:px-6 lg:px-8">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 inline-block">
                            AI-Powered EV Recovery Discovery
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            The Future of <span className="bg-gradient-to-r from-primary-400 to-accent-glow bg-clip-text text-transparent">EV Charging</span> <br />
                            at Your Fingertips
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Find chargers near you, predict availability with AI, and manage your charging hubs with GIS-powered insights. Seamless, smart, and sustainable.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/map" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                                Explore Map <MapPin size={20} />
                            </Link>
                            <Link to="/register" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
                                Become an Owner <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 border-t border-slate-800/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Cpu className="text-primary-400" size={32} />,
                            title: "AI Availability Prediction",
                            desc: "Know exactly when a station will be free using our Grok-powered predictive analytics."
                        },
                        {
                            icon: <MapPin className="text-accent-glow" size={32} />,
                            title: "GIS Map Discovery",
                            desc: "Locate charging hubs in real-time with precise GIS mapping and clustering."
                        },
                        {
                            icon: <BarChart3 className="text-primary-400" size={32} />,
                            title: "Owner Analytics",
                            desc: "Manage your stations with detailed demand reports and performance tracking."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card"
                        >
                            <div className="w-14 h-14 bg-slate-800/50 rounded-xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900/40 py-20 border-y border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Active Stations", value: "2,500+" },
                            { label: "Predictive Accuracy", value: "98%" },
                            { label: "User Satisfaction", value: "4.9/5" },
                            { label: "Energy Optimized", value: "1.2 GW" }
                        ].map((stat, idx) => (
                            <div key={idx}>
                                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
