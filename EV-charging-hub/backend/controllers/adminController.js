const Station = require('../models/Station');
const User = require('../models/User');

exports.getGlobalStats = async (req, res) => {
    try {
        const totalStations = await Station.countDocuments();
        const approvedStations = await Station.countDocuments({ status: 'approved' });
        const pendingStations = await Station.countDocuments({ status: 'pending' });
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOwners = await User.countDocuments({ role: 'owner' });

        res.json({
            totalStations,
            approvedStations,
            pendingStations,
            totalUsers,
            totalOwners
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.moderateStation = async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    try {
        const station = await Station.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!station) return res.status(404).json({ message: 'Station not found' });
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.simulateTraffic = async (req, res) => {
    try {
        const stations = await Station.find({ status: 'approved' });
        for (const station of stations) {
            // Randomly toggle availability (70% live, 30% busy)
            station.isAvailable = Math.random() > 0.3;
            await station.save();
        }
        res.json({ message: 'Traffic simulated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

