const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    address: { type: String, required: true },
    chargerTypes: [{ type: String, enum: ['AC', 'DC', 'Type2', 'CCS', 'CHAdeMO'], required: true }],
    powerRating: { type: Number, required: true }, // in kW
    pricing: { type: Number, required: true }, // pricing per kWh or per hr
    timings: { type: String, required: true },
    connectorsCount: { type: Number, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isAvailable: { type: Boolean, default: true },
    amenities: [String], // Changed from [{ type: String }] to [String] as per the provided Code Edit
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
}, { timestamps: true });

stationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Station', stationSchema);
