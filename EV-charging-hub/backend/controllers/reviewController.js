const Review = require('../models/Review');
const Station = require('../models/Station');

exports.addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { stationId } = req.params;
    try {
        const review = await Review.create({
            station: stationId,
            user: req.user.id,
            rating,
            comment
        });

        // Update station stats
        const reviews = await Review.find({ station: stationId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await Station.findByIdAndUpdate(stationId, {
            averageRating: avgRating,
            reviewsCount: reviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStationReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ station: req.params.stationId }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
