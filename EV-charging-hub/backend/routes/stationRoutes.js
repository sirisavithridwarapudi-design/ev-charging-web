const express = require('express');
const router = express.Router();
const {
    createStation,
    getStations,
    getStationById,
    updateStation,
    deleteStation,
    getStationAIPrediction,
    getOwnerStations
} = require('../controllers/stationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getStations);
router.get('/owner', protect, authorize('owner'), getOwnerStations);
router.get('/:id', getStationById);
router.get('/:id/predict', getStationAIPrediction);

router.post('/', protect, authorize('owner'), createStation);
router.put('/:id', protect, authorize('owner', 'admin'), updateStation);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteStation);

module.exports = router;
