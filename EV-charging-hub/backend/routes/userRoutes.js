const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/favorites', toggleFavorite);
router.get('/favorites', getFavorites);

module.exports = router;
