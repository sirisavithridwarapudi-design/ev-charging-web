const express = require('express');
const router = express.Router();
const { addReview, getStationReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:stationId', getStationReviews);
router.post('/:stationId', protect, addReview);

module.exports = router;
