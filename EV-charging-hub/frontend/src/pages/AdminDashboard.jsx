import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, MapPin, Check, X, AlertCircle, BarChart, Settings, Trash2, Save, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pendingStations, setPendingStations] = useState([]);
    const [allStations, setAllStations] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('moderation');
    const [editingStation, setEditingStation] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };
            const [statsRes, stationsRes, allStationsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', authHeader),
                axios.get('http://localhost:5000/api/stations?status=pending', authHeader),
                axios.get('http://localhost:5000/api/stations', authHeader),
                axios.get('http://localhost:5000/api/admin/users', authHeader)
            ]);
            setStats(statsRes.data);
            setPendingStations(stationsRes.data);
            setAllStations(allStationsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Admin Fetch Error");
        }
    };

    const moderate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/moderate/${id}`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData();
        } catch (error) {
            alert("Moderation failed");
        }
    };

    const openStationEditor = (station) => {
        setEditingStation(station);
        setEditForm({
            name: station.name || '',
            address: station.address || '',
            lat: station.location?.coordinates?.[1] ?? '',
            lng: station.location?.coordinates?.[0] ?? '',
            chargerTypes: station.chargerTypes || [],
            powerRating: station.powerRating ?? '',
            pricing: station.pricing ?? '',
            timings: station.timings || '',
            connectorsCount: station.connectorsCount ?? '',
        });
    };

    const saveStation = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/stations/${editingStation._id}`, {
                name: editForm.name,
                address: editForm.address,
                location: { type: 'Point', coordinates: [parseFloat(editForm.lng), parseFloat(editForm.lat)] },
                chargerTypes: editForm.chargerTypes,
                powerRating: parseFloat(editForm.powerRating),
                pricing: parseFloat(editForm.pricing),
                timings: editForm.timings,
                connectorsCount: parseInt(editForm.connectorsCount, 10),
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            setEditingStation(null);
            setEditForm(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Station update failed');
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm("Remove user?")) {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData();
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <ShieldCheck className="text-primary-400" size={32} /> Central Intelligence
                        </h1>
                        <p className="text-slate-400">System control and moderation hub</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={async () => {
                                await axios.post('http://localhost:5000/api/admin/simulate-traffic', {}, { headers: { Authorization: `Bearer ${user.token}` } });
                                alert("Traffic simulated! Station statuses updated.");
                                fetchData();
                            }}
                            className="px-4 py-2 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl text-sm font-bold hover:bg-orange-500 hover:text-white transition-all"
                        >
                            Simulate Traffic
                        </button>
                        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
                            {['moderation', 'analytics', 'users'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Total Stations', value: stats.totalStations, icon: <MapPin />, color: 'primary' },
                            { label: 'Pending Review', value: stats.pendingStations, icon: <AlertCircle />, color: 'yellow' },
                            { label: 'Registered Users', value: stats.totalUsers, icon: <Users />, color: 'emerald' },
                            { label: 'Station Owners', value: stats.totalOwners, icon: <ShieldCheck />, color: 'purple' },
                        ].map((s, i) => (
                            <div key={i} className="glass-card flex items-center gap-4">
                                <div className={`w-12 h-12 bg-${s.color}-500/20 rounded-xl flex items-center justify-center text-${s.color}-400`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{s.value}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'moderation' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Pending Approvals ({pendingStations.length})</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {pendingStations.map(station => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={station._id}
                                    className="glass-card flex flex-col md:flex-row justify-between items-center gap-6"
                                >
                                    <div className="flex gap-6 items-center flex-1">
                                        <img src={station.images[0] || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=200'} className="w-20 h-20 rounded-lg object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg">{station.name}</h3>
                                            <p className="text-sm text-slate-500">{station.address}</p>
                                            <div className="text-xs text-primary-400 mt-1 font-bold">Owner: {station.owner?.name} ({station.owner?.email})</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => moderate(station._id, 'approved')}
                                            className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                                        >
                                            <Check size={20} />
                                        </button>
                                        <button
                                            onClick={() => moderate(station._id, 'rejected')}
                                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button onClick={() => openStationEditor(station)} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-primary-500/20 hover:text-primary-300 transition-colors" title="Edit station">
                                            <Settings size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {pendingStations.length === 0 && (
                                <div className="py-20 text-center glass-card border-dashed">
                                    <Check className="mx-auto mb-4 text-emerald-500" size={48} />
                                    <p className="text-slate-500 font-medium">All clear! No pending station listings.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">All Stations</h2>
                                    <p className="text-sm text-slate-500">Edit any station, including approved listings.</p>
                                </div>
                                <span className="text-xs text-slate-500">{allStations.length} total</span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {allStations.map(station => (
                                    <div key={station._id} className="glass-card flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="font-bold truncate">{station.name}</h3>
                                            <p className="text-xs text-slate-500 truncate">{station.address}</p>
                                            <span className={`inline-block mt-2 text-[10px] font-bold uppercase ${station.status === 'approved' ? 'text-emerald-400' : station.status === 'pending' ? 'text-primary-300' : 'text-red-400'}`}>{station.status}</span>
                                        </div>
                                        <button onClick={() => openStationEditor(station)} className="btn-secondary shrink-0 py-2 px-3 text-xs" title={`Edit ${station.name}`}>
                                            <Pencil size={14} /> Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-card overflow-hidden !p-0">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-900/30 transition-colors">
                                        <td className="px-6 py-4 font-medium whitespace-nowrap">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'owner' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                className="text-red-500 hover:text-red-400 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card">
                            <h3 className="font-bold mb-6 flex items-center gap-2"><BarChart size={18} /> Load Distribution</h3>
                            <div className="h-64 flex items-end gap-2 px-4">
                                {[40, 70, 45, 90, 65, 80, 50].map((v, i) => (
                                    <div key={i} className="flex-1 bg-primary-500/20 border-t-2 border-primary-500 relative group">
                                        <div style={{ height: `${v}%` }} className="bg-primary-500/40 group-hover:bg-primary-500 transition-all cursor-pointer"></div>
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500">Day {i + 1}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card">
                            <h3 className="font-bold mb-6">System Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                    <span className="text-sm">Database Latency</span>
                                    <span className="text-emerald-500 font-bold">12ms</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                    <span className="text-sm">AI Response Time</span>
                                    <span className="text-emerald-500 font-bold">420ms</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                    <span className="text-sm">Map Tiles Load</span>
                                    <span className="text-emerald-500 font-bold">98.2%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {editingStation && editForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.form
                            initial={{ opacity: 0, y: 18, scale: .98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            onSubmit={saveStation}
                            className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-primary-400 font-bold">Station controls</p>
                                    <h2 className="text-2xl font-bold mt-1">Edit {editingStation.name}</h2>
                                </div>
                                <button type="button" onClick={() => { setEditingStation(null); setEditForm(null); }} className="text-slate-400 hover:text-white"><X size={22} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    ['name', 'Station name', 'text'],
                                    ['address', 'Address', 'text'],
                                    ['lat', 'Latitude', 'number'],
                                    ['lng', 'Longitude', 'number'],
                                    ['powerRating', 'Power rating (kW)', 'number'],
                                    ['pricing', 'Price per kWh', 'number'],
                                    ['timings', 'Timings', 'text'],
                                    ['connectorsCount', 'Connector count', 'number'],
                                ].map(([field, label, type]) => (
                                    <label key={field} className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                        {label}
                                        <input
                                            required
                                            type={type}
                                            step={type === 'number' ? 'any' : undefined}
                                            value={editForm[field]}
                                            onChange={(event) => setEditForm({ ...editForm, [field]: event.target.value })}
                                            className="input-field mt-2 normal-case tracking-normal font-normal"
                                        />
                                    </label>
                                ))}
                            </div>
                            <div className="mt-5">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Charger types</p>
                                <div className="flex flex-wrap gap-2">
                                    {['AC', 'DC', 'Type2', 'CCS', 'CHAdeMO'].map(type => {
                                        const selected = editForm.chargerTypes.includes(type);
                                        return <button key={type} type="button" onClick={() => setEditForm({ ...editForm, chargerTypes: selected ? editForm.chargerTypes.filter(item => item !== type) : [...editForm.chargerTypes, type] })} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${selected ? 'bg-primary-500/20 border-primary-400 text-primary-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{type}</button>;
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => { setEditingStation(null); setEditForm(null); }} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary"><Save size={17} /> Save changes</button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
