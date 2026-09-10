import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Zap, Clock, DollarSign, Trash2, CheckCircle, Clock4, X, Brain, Sparkles, XCircle, Navigation, Battery } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [aiInsight, setAiInsight] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [formData, setFormData] = useState({
        name: '', address: '', chargerTypes: [], powerRating: '', pricing: '', timings: '24/7', connectorsCount: '', lat: '', lng: '', amenities: []
    });

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyStations();
    }, []);

    const fetchMyStations = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/stations/owner', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStations(data);
        } catch (error) {
            console.error("Error fetching my stations");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStation = async (e) => {
        e.preventDefault();
        try {
            const stationData = {
                ...formData,
                location: { coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)] }
            };
            await axios.post('http://localhost:5000/api/stations', stationData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setShowAddModal(false);
            fetchMyStations();
        } catch (error) { alert("Error adding station"); }
    };

    const toggleAvailability = async (id, current) => {
        try {
            await axios.put(`http://localhost:5000/api/stations/${id}`, { isAvailable: !current }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchMyStations();
        } catch (error) { console.error("Error updating status"); }
    };

    const deleteStation = async (id) => {
        if (!window.confirm("Delete this station?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/stations/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchMyStations();
        } catch (error) { console.error("Error deleting station"); }
    };

    const getAIInsights = async () => {
        setLoadingAI(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/ai/chat', {
                message: "I am an EV station owner. Given my portfolio of " + stations.length + " stations, what are some strategic tips for increasing revenue and improving station availability? Keep it brief and professional."
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAiInsight(data.response);
        } catch (error) {
            console.error("AI Insight Error");
            setAiInsight("AI analysis currently unavailable. Check your connection to the smart grid node.");
        } finally { setLoadingAI(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-primary-500">Initializing Quantum Grid...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Station Management</h1>
                        <p className="text-slate-400">Control your charging infrastructure and analyze performance</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={getAIInsights} disabled={loadingAI} className="btn-secondary py-3 px-6 flex items-center gap-2 group border-primary-500/20 hover:border-primary-500/50">
                            <Brain className={`text-primary-400 ${loadingAI ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'}`} />
                            {loadingAI ? 'Analyzing...' : 'Strategic AI Insights'}
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="btn-primary py-3 px-6 flex items-center gap-2">
                            <Plus size={20} /> Add Station
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {aiInsight && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card mb-12 relative overflow-hidden group border-primary-500/30 bg-primary-500/5">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Sparkles className="text-primary-400 animate-pulse w-24 h-24" />
                            </div>
                            <h3 className="text-lg font-bold text-primary-400 mb-2 flex items-center gap-2">
                                <Sparkles size={18} /> Smart Recommendation
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl italic">
                                "{aiInsight}"
                            </p>
                            <button onClick={() => setAiInsight(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                                <XCircle size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: 'Total Hubs', value: stations.length, icon: Zap, color: 'primary' },
                        { label: 'Approved', value: stations.filter(s => s.status === 'approved').length, icon: CheckCircle, color: 'emerald' },
                        { label: 'Pending', value: stations.filter(s => s.status === 'pending').length, icon: Clock4, color: 'yellow' },
                        { label: 'Est. Revenue', value: '$1,240', icon: DollarSign, color: 'primary' }
                    ].map((stat, i) => (
                        <div key={i} className="glass-card flex items-center gap-4 border-slate-800/50">
                            <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center text-${stat.color}-400`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-8">
                        <MapPin className="text-primary-400" /> Your Listed Stations
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {stations.map(station => (
                            <motion.div key={station._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex flex-col sm:flex-row gap-6 hover:border-slate-700 transition-all group">
                                <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden rounded-xl">
                                    <img src={station.images[0] || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[8px] font-black uppercase backdrop-blur-md border ${station.isAvailable ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                        {station.isAvailable ? 'Online' : 'Offline'}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xl font-bold">{station.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${station.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : station.status === 'pending' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-500'}`}>
                                            {station.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                                        <MapPin size={12} /> {station.address}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400"><Zap size={14} className="text-primary-400" /> {station.powerRating} kW</div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400"><Battery size={14} className="text-primary-400" /> {station.connectorsCount} Ports</div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400"><DollarSign size={14} className="text-primary-400" /> ${station.pricing}/kWh</div>
                                    </div>

                                    {station.status === 'pending' && (
                                        <div className="mb-4 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                            <p className="text-[10px] text-blue-400 italic">Moderators are reviewing this station. It will appear on discovery map once approved.</p>
                                        </div>
                                    )}

                                    <div className="mt-auto flex gap-2">
                                        <button onClick={() => navigate('/map', { state: { center: [station.location.coordinates[1], station.location.coordinates[0]], selectedStation: station } })} className="btn-secondary py-2 text-[10px] flex-1">View Map</button>
                                        <button onClick={() => toggleAvailability(station._id, station.isAvailable)} className={`py-2 px-4 rounded-xl border text-[10px] font-bold transition-all ${station.isAvailable ? 'border-red-500 text-red-500 hover:bg-red-500/10' : 'border-green-500 text-green-500 hover:bg-green-500/10'}`}>
                                            {station.isAvailable ? 'Go Offline' : 'Go Online'}
                                        </button>
                                        <button onClick={() => deleteStation(station._id)} className="p-2 border border-slate-700 text-slate-500 hover:text-red-500 hover:border-red-500/50 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {stations.length === 0 && !loading && (
                        <div className="py-20 text-center glass-card border-dashed flex flex-col items-center">
                            <Zap size={48} className="text-slate-800 mb-4" />
                            <p className="text-slate-500 mb-6">You haven't listed any charging stations yet.</p>
                            <button onClick={() => setShowAddModal(true)} className="btn-primary py-3 px-8">Add Your First Station</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Station Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>

                            <h2 className="text-2xl font-bold mb-8">Register New Hub</h2>

                            <form onSubmit={handleAddStation} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Station Name</label>
                                        <input className="input-field" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Downtown Fast Charge" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Full Address</label>
                                        <input className="input-field" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Energy St, City" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Latitude</label>
                                        <input className="input-field" required type="number" step="any" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} placeholder="e.g., 51.505" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Longitude</label>
                                        <input className="input-field" required type="number" step="any" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} placeholder="e.g., -0.09" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Power Rating (kW)</label>
                                        <input className="input-field" required type="number" value={formData.powerRating} onChange={(e) => setFormData({ ...formData, powerRating: e.target.value })} placeholder="e.g., 150" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Pricing ($/kWh)</label>
                                        <input className="input-field" required type="number" step="0.01" value={formData.pricing} onChange={(e) => setFormData({ ...formData, pricing: e.target.value })} placeholder="e.g., 0.45" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Connectors Count</label>
                                        <input className="input-field" required type="number" value={formData.connectorsCount} onChange={(e) => setFormData({ ...formData, connectorsCount: e.target.value })} placeholder="e.g., 4" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Charger Types</label>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {['AC', 'DC', 'Type2', 'CCS', 'CHAdeMO'].map(type => (
                                                <button key={type} type="button" onClick={() => {
                                                    const types = formData.chargerTypes.includes(type) ? formData.chargerTypes.filter(t => t !== type) : [...formData.chargerTypes, type];
                                                    setFormData({ ...formData, chargerTypes: types });
                                                }} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${formData.chargerTypes.includes(type) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Amenities</label>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {['Wifi', 'Cafe', 'Restroom', 'Lounge', 'Shopping'].map(amn => (
                                            <button key={amn} type="button" onClick={() => {
                                                const amns = formData.amenities.includes(amn) ? formData.amenities.filter(a => a !== amn) : [...formData.amenities, amn];
                                                setFormData({ ...formData, amenities: amns });
                                            }} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${formData.amenities.includes(amn) ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                                                {amn}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full btn-primary py-4 text-sm font-bold shadow-lg shadow-primary-500/20">Submit for Approval</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OwnerDashboard;
