import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Cpu, Navigation, Info, Zap, X, Heart, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Fix for Leaflet marker icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const createStationIcon = (color, isSelected = false) => L.divIcon({
    html: `<div class="relative ${isSelected ? 'scale-150 z-[1000]' : ''}">
            ${isSelected ? '<div class="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-50 scale-150"></div>' : ''}
            <div class="w-8 h-8 rounded-full bg-slate-900 border-2 ${isSelected ? 'border-primary-400 shadow-[0_0_20px_rgba(14,165,233,0.8)]' : color === 'primary' ? 'border-sky-500' : 'border-emerald-500'} flex items-center justify-center relative z-10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#38bdf8' : (color === 'primary' ? '#0ea5e9' : '#10b981')}" stroke-width="3">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                ${isSelected ? '<div class="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"></div>' : ''}
            </div>
            ${isSelected ? '<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-primary-600 text-[8px] font-bold px-1.5 py-0.5 rounded text-white whitespace-nowrap shadow-lg">TARGET</div>' : ''}
         </div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const MapDiscovery = () => {
    const [stations, setStations] = useState([]);
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [radius, setRadius] = useState(10000);
    const [filters, setFilters] = useState({ type: '', status: 'approved', maxPrice: 2, minPower: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [userFavorites, setUserFavorites] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    const { user } = useAuth();
    const navigate = useNavigate();
    const locationState = useLocation().state;

    useEffect(() => {
        if (locationState?.center) {
            setUserLocation(locationState.center);
            if (locationState.selectedStation) {
                setSelectedStation(locationState.selectedStation);
            }
        } else {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.log("Location access denied")
            );
        }
        if (user) fetchUserFavorites();
    }, [locationState]);

    useEffect(() => {
        fetchStations();
    }, [userLocation, radius, filters]);

    useEffect(() => {
        if (selectedStation) fetchReviews(selectedStation._id);
    }, [selectedStation]);

    const fetchUserFavorites = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/user/favorites', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUserFavorites(data.map(f => f._id));
        } catch (error) { console.error("Error fetching favorites"); }
    };

    const toggleFavorite = async (stationId) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/user/favorites', { stationId }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUserFavorites(data);
        } catch (error) { console.error("Error toggling favorite"); }
    };

    const fetchStations = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/stations?lat=${userLocation[0]}&lng=${userLocation[1]}&radius=${radius}&type=${filters.type}&status=${filters.status}&maxPrice=${filters.maxPrice}&minPower=${filters.minPower}`);
            setStations(data);
        } catch (error) { console.error("Error fetching stations"); }
    };

    const fetchReviews = async (id) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/reviews/${id}`);
            setReviews(data);
        } catch (error) { console.error("Error fetching reviews"); }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/reviews/${selectedStation._id}`, newReview, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews(selectedStation._id);
            fetchStations();
        } catch (error) { alert("Error submitting review"); }
    };

    const getPrediction = async (id) => {
        setLoadingPrediction(true);
        setPrediction(null);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/stations/${id}/predict`);
            setPrediction(data);
        } catch (error) { console.error("AI Prediction Error"); }
        finally { setLoadingPrediction(false); }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const searchAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setUserLocation([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert("Location not found");
            }
        } catch (error) {
            console.error("Search error", error);
        }
    };

    return (
        <div className="h-screen w-full pt-16 flex relative overflow-hidden bg-slate-950">
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 400 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="glass border-r border-slate-800/50 z-20 overflow-y-auto"
            >
                <div className="p-6 w-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Search className="text-primary-400" /> Discovery
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={`p-2 rounded-lg transition-all ${showHeatmap ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-slate-800 text-slate-500 border border-transparent'}`}
                            >
                                <Zap size={18} fill={showHeatmap ? "currentColor" : "none"} />
                            </button>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={searchAddress} className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-10 py-3 text-sm"
                                placeholder="Search city or zip code..."
                            />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </form>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Search Radius ({radius / 1000}km)</label>
                            <input type="range" min="1000" max="20000" step="1000" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Max Price (${filters.maxPrice})</label>
                                <input type="range" min="0.1" max="5" step="0.1" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Min Power ({filters.minPower}kW)</label>
                                <input type="range" min="0" max="350" step="50" value={filters.minPower} onChange={(e) => setFilters({ ...filters, minPower: e.target.value })} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Charger Type</label>
                            <select className="input-field py-2 text-xs" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                                <option value="">All Types</option>
                                <option value="AC">AC (Regular)</option>
                                <option value="DC">DC (Fast)</option>
                                <option value="Type2">Type 2</option>
                                <option value="CCS">CCS</option>
                                <option value="CHAdeMO">CHAdeMO</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase">Nearby Stations ({stations.length})</h3>
                            <div className="space-y-3">
                                {stations.map(station => (
                                    <div
                                        key={station._id}
                                        onClick={() => { setSelectedStation(station); setUserLocation([station.location.coordinates[1], station.location.coordinates[0]]); }}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedStation?._id === station._id ? 'bg-primary-500/10 border-primary-500/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm">{station.name}</h4>
                                            <div className="flex items-center gap-2">
                                                {userFavorites.includes(station._id) && <Heart size={12} className="text-red-500 fill-current" />}
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${station.isAvailable ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {station.isAvailable ? 'Live' : 'Busy'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 truncate mb-2">{station.address}</p>
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-slate-400">{station.powerRating} kW</span>
                                            <span className="text-primary-400">${station.pricing}/kWh</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {!isSidebarOpen && (
                <div className="absolute left-6 top-24 z-30 flex flex-col gap-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-xl"><Filter size={20} /></button>
                    <button onClick={() => setShowHeatmap(!showHeatmap)} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all ${showHeatmap ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}><Zap size={20} /></button>
                </div>
            )}

            <div className="flex-1 relative">
                <MapContainer center={userLocation} zoom={13} className="h-full w-full">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <Circle center={userLocation} radius={radius} pathOptions={{ color: '#0ea5e9', fillOpacity: 0.1, weight: 1 }} />

                    {showHeatmap && stations.map(s => !s.isAvailable && (
                        <Circle key={`h-${s._id}`} center={[s.location.coordinates[1], s.location.coordinates[0]]} radius={800} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.3, weight: 0 }} />
                    ))}

                    {stations.map((s) => (
                        <Marker
                            key={s._id}
                            position={[s.location.coordinates[1], s.location.coordinates[0]]}
                            icon={createStationIcon(s.isAvailable ? 'primary' : 'emerald', selectedStation?._id === s._id)}
                            zIndexOffset={selectedStation?._id === s._id ? 1000 : 0}
                            eventHandlers={{ click: () => setSelectedStation(s) }}
                        >
                            {(selectedStation?._id === s._id || stations.length < 5) && (
                                <Tooltip permanent direction="top" offset={[0, -20]} className="bg-slate-900 border-primary-500 text-white font-bold text-[10px] rounded-lg border px-2 py-1 shadow-xl">
                                    {s.name}
                                </Tooltip>
                            )}
                        </Marker>
                    ))}

                    {selectedStation && (
                        <Circle
                            center={[selectedStation.location.coordinates[1], selectedStation.location.coordinates[0]]}
                            radius={200}
                            pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.2, weight: 2, dashArray: '5, 10' }}
                        />
                    )}
                    <MapUpdater center={userLocation} />
                </MapContainer>

                <AnimatePresence>
                    {selectedStation && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
                            className="absolute right-6 top-6 bottom-6 w-96 glass-card z-30 overflow-y-auto flex flex-col p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{selectedStation.name}</h3>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleFavorite(selectedStation._id)} className={`p-2 rounded-lg transition-colors ${userFavorites.includes(selectedStation._id) ? 'bg-red-500/20 text-red-500' : 'text-slate-500'}`}>
                                        <Heart size={20} fill={userFavorites.includes(selectedStation._id) ? "currentColor" : "none"} />
                                    </button>
                                    <button onClick={() => { setSelectedStation(null); setPrediction(null); }} className="text-slate-500 hover:text-white"><X size={20} /></button>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-6">
                                <img src={selectedStation.images[0] || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400'} className="w-24 h-24 rounded-xl object-cover" />
                                <div>
                                    <div className="flex items-center gap-1 text-primary-400 mb-1 font-bold text-sm"><Zap size={14} fill="currentColor" /> {selectedStation.powerRating} kW</div>
                                    <p className="text-[10px] text-slate-400 mb-2">{selectedStation.address}</p>
                                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-bold">${selectedStation.pricing}/kWh</span>
                                </div>
                            </div>

                            {selectedStation.amenities?.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2">Amenities Nearby</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStation.amenities.map(a => <span key={a} className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-[10px] text-slate-300">{a}</span>)}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto flex flex-col gap-4">
                                <button onClick={() => getPrediction(selectedStation._id)} disabled={loadingPrediction} className="w-full btn-secondary py-3 text-sm flex items-center justify-center gap-2 group relative overflow-hidden">
                                    <Cpu className="text-primary-400" size={18} /> {loadingPrediction ? 'Analyzing...' : 'AI Availability Prediction'}
                                </button>

                                {prediction && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 bg-primary-500/5 rounded-2xl p-4 border border-primary-500/20">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-primary-400">Demand: <span className={prediction.demandLevel === 'Low' ? 'text-green-500' : 'text-yellow-500'}>{prediction.demandLevel}</span></div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {Object.entries(prediction.predictions).map(([t, s]) => (
                                                <div key={t} className="text-center p-2 bg-slate-900 rounded-lg border border-slate-800 text-[8px]">
                                                    <div className="text-slate-500 mb-1 uppercase">{t}</div>
                                                    <div className="font-bold text-slate-300">{s}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic">"{prediction.summary}"</p>
                                    </motion.div>
                                )}

                                <div className="border-t border-slate-800 pt-6">
                                    <h4 className="text-xs font-bold mb-4 flex items-center gap-2"><MessageSquare size={14} /> Reviews ({reviews.length})</h4>
                                    <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                                        {reviews.map(r => (
                                            <div key={r._id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                                <div className="flex justify-between items-center mb-1 text-[10px]">
                                                    <span className="font-bold text-slate-300">{r.user?.name}</span>
                                                    <span className="text-yellow-500">★ {r.rating}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500">{r.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={submitReview} className="space-y-3">
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(s => <button key={s} type="button" onClick={() => setNewReview({ ...newReview, rating: s })} className={`text-sm ${newReview.rating >= s ? 'text-yellow-500' : 'text-slate-700'}`}>★</button>)}
                                        </div>
                                        <textarea className="input-field py-2 text-[10px]" placeholder="Write a review..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} rows="2" />
                                        <button type="submit" className="w-full btn-secondary py-2 text-[10px]">Submit</button>
                                    </form>
                                </div>

                                <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.location.coordinates[1]},${selectedStation.location.coordinates[0]}`} target="_blank" rel="noreferrer" className="w-full btn-primary py-3 text-sm mt-4">
                                    Navigate <Navigation size={18} />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => { map.flyTo(center, 13); }, [center, map]);
    return null;
};

export default MapDiscovery;
