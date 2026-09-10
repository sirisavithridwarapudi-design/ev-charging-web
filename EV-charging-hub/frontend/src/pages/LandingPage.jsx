import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BatteryCharging, CircleGauge, MapPin, ScanLine, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    { number: '01', icon: MapPin, title: 'Find your next stop', copy: 'A live map of the charge points that fit your route, car, and schedule.' },
    { number: '02', icon: CircleGauge, title: 'See the likely wait', copy: 'AI-powered availability signals help you arrive with less guesswork.' },
    { number: '03', icon: BatteryCharging, title: 'Charge with confidence', copy: 'Clear station details, reviews, and pricing in one calm interface.' },
];

const LandingPage = () => (
    <main className="landing-page">
        <section className="hero-shell">
            <div className="hero-image" aria-hidden="true" />
            <div className="hero-grid" aria-hidden="true" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
                <div className="hero-content">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }} className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-7"><span className="status-dot" /><span className="mono-label text-xs text-primary-200">The intelligent charging network</span></div>
                        <h1 className="hero-title">Charge smarter.<br /><span>Go further.</span></h1>
                        <p className="hero-copy">Find the right charger, understand the wait, and keep your journey moving with one clear view of the EV network.</p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Link to="/map" className="btn-primary text-base">Explore the network <ArrowUpRight size={18} /></Link>
                            <Link to="/register" className="btn-secondary text-base">List your station</Link>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .18, ease: 'easeOut' }} className="hero-data glass">
                        <div className="flex items-center justify-between mb-7"><span className="mono-label text-[10px] text-slate-400">Network pulse</span><span className="live-pill"><span className="status-dot" /> Live</span></div>
                        <div className="text-4xl font-extrabold tracking-tight text-white">2,500<span className="text-primary-300">+</span></div>
                        <p className="text-sm text-slate-400 mt-1">charge points mapped nearby</p>
                        <div className="data-rule" />
                        <div className="flex items-end justify-between"><div><div className="text-2xl font-bold text-primary-200">98.4%</div><p className="text-xs text-slate-500 mt-1">prediction confidence</p></div><ScanLine className="text-primary-300" size={28} strokeWidth={1.5} /></div>
                    </motion.div>
                </div>
                <div className="hero-scroll mono-label text-[10px] text-slate-300/70"><span className="scroll-line" /> Scroll to discover</div>
            </div>
        </section>

        <section className="py-24 sm:py-32 bg-[#10120f]">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                <div className="section-intro"><div><span className="mono-label text-xs text-primary-300">01 / One connected view</span><h2 className="section-title">Every charge,<br /><em>less complicated.</em></h2></div><p className="section-lede">From the first search to the final kilowatt, VoltHub makes the road ahead feel more certain.</p></div>
                <div className="feature-grid">
                    {features.map(({ number, icon: Icon, title, copy }, index) => <motion.article key={number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: index * .1 }} className="feature-item"><div className="flex items-start justify-between mb-16"><div className="feature-icon"><Icon size={21} strokeWidth={1.7} /></div><span className="mono-label text-xs text-slate-500">{number}</span></div><h3>{title}</h3><p>{copy}</p></motion.article>)}
                </div>
            </div>
        </section>

        <section className="image-band"><div className="image-band-photo" aria-hidden="true" /><div className="image-band-shade" aria-hidden="true" /><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10"><div className="image-band-content"><span className="mono-label text-xs text-primary-200">02 / Built for the road</span><h2>Good energy<br /><span>goes further.</span></h2><p>See what is open, what is close, and what is worth the detour.</p><Link to="/map" className="inline-flex items-center gap-2 text-primary-200 font-semibold mt-6 hover:text-white transition-colors">Open live discovery <ArrowUpRight size={17} /></Link></div></div></section>

        <section className="py-16 bg-primary-300 text-[#182006]"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">{[['2.5k+', 'active stations'], ['98%', 'prediction accuracy'], ['4.9 / 5', 'driver rating'], ['1.2 GW', 'energy optimized']].map(([value, label]) => <div key={label}><div className="text-3xl sm:text-4xl font-extrabold tracking-tight">{value}</div><div className="mono-label text-[10px] mt-2 opacity-70">{label}</div></div>)}</div></section>

        <section className="py-24 sm:py-28 bg-[#171b14]"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col md:flex-row md:items-end justify-between gap-8"><div><div className="flex items-center gap-2 text-primary-300 mb-4"><Sparkles size={16} /><span className="mono-label text-xs">Ready when you are</span></div><h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl">Make the next stop the easy one.</h2></div><Link to="/register" className="btn-primary shrink-0">Get started <ArrowUpRight size={18} /></Link></div></section>

        <footer className="py-8 bg-[#10120f] border-t border-white/10"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-xs text-slate-500"><div className="flex items-center gap-2 text-slate-300"><Zap size={15} className="text-primary-300" fill="currentColor" /> VoltHub</div><div className="flex items-center gap-2"><ShieldCheck size={14} /> Charging, with a little more clarity.</div></div></footer>
    </main>
);

export default LandingPage;
