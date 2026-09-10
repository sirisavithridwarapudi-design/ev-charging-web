const express = require('express');
const router = express.Router();
const { getGlobalStats, moderateStation, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getGlobalStats);
router.get('/users', getAllUsers);
router.put('/moderate/:id', moderateStation);
router.delete('/users/:id', deleteUser);
router.post('/simulate-traffic', require('../controllers/adminController').simulateTraffic);


module.exports = router;
