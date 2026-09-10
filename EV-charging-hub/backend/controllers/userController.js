const User = require('../models/User');
const Station = require('../models/Station');

exports.toggleFavorite = async (req, res) => {
    const { stationId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.favorites.indexOf(stationId);

        if (index === -1) {
            user.favorites.push(stationId);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) return res.json([]);
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
