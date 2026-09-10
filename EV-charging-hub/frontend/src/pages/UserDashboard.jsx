import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, MapPin, Zap, Navigation, Trash2, Battery } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/user/favorites', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setFavorites(data);
        } catch (error) {
            console.error("Error fetching favorites");
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (stationId) => {
        try {
            await axios.post('http://localhost:5000/api/user/favorites', { stationId }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchFavorites();
        } catch (error) {
            console.error("Error removing favorite");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Heart className="text-red-500 fill-current" /> My Favorite Hubs
                    </h1>
                    <p className="text-slate-400 mt-2">Quick access to your preferred charging locations</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading your favorites...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map(station => (
                            <motion.div
                                key={station._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card group"
                            >
                                <div className="relative mb-4 overflow-hidden rounded-xl h-48">
                                    <img
                                        src={station.images[0] || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400'}
                                        alt={station.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md ${station.isAvailable ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                        {station.isAvailable ? 'Available' : 'Busy'}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{station.name}</h3>
                                <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                                    <MapPin size={14} /> {station.address}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Zap size={14} className="text-primary-400" /> {station.powerRating} kW
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Battery size={14} className="text-primary-400" /> {station.connectorsCount} Ports
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${station.location.coordinates[1]},${station.location.coordinates[0]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-primary flex-1 py-2 text-sm"
                                    >
                                        Navigate <Navigation size={14} />
                                    </a>
                                    <button
                                        onClick={() => removeFavorite(station._id)}
                                        className="p-2 border border-slate-700 hover:border-red-500/50 hover:text-red-500 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {favorites.length === 0 && (
                            <div className="col-span-full py-20 text-center glass-card border-dashed">
                                <Heart className="mx-auto mb-4 text-slate-700" size={48} />
                                <p className="text-slate-500 mb-6">You haven't favorited any stations yet.</p>
                                <Link to="/map" className="btn-primary inline-flex">Explore Map</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
