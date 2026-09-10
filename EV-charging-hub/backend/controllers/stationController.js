const Station = require('../models/Station');
const groqService = require('../utils/groqService');

exports.createStation = async (req, res) => {
    try {
        const station = await Station.create({ ...req.body, owner: req.user.id });
        res.status(201).json(station);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStations = async (req, res) => {
    const { lat, lng, radius, type, status, minPower, maxPrice } = req.query;
    try {
        let query = {};

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(radius) || 10000
                }
            };
        }

        if (status) query.status = status;
        if (type) query.chargerTypes = { $in: [type] };
        if (minPower) query.powerRating = { $gte: parseInt(minPower) };
        if (maxPrice) query.pricing = { $lte: parseFloat(maxPrice) };

        const stations = await Station.find(query);
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStationById = async (req, res) => {
    try {
        const station = await Station.findById(req.params.id).populate('owner', 'name email');
        if (!station) return res.status(404).json({ message: 'Station not found' });
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStation = async (req, res) => {
    try {
        let station = await Station.findById(req.params.id);
        if (!station) return res.status(404).json({ message: 'Station not found' });

        if (station.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        station = await Station.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStation = async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (!station) return res.status(404).json({ message: 'Station not found' });

        if (station.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await station.deleteOne();
        res.json({ message: 'Station removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStationAIPrediction = async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (!station) return res.status(404).json({ message: 'Station not found' });

        const prediction = await groqService.getPrediction(station);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOwnerStations = async (req, res) => {
    try {
        const stations = await Station.find({ owner: req.user.id });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
