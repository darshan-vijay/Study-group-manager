const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const multer = require('multer');

// Setup multer for file uploads (profile picture)
const upload = multer({ dest: 'uploads/' });

// Route to view profile
router.get('/profile/:clientId', profileController.viewProfile);

// Route to edit profile
router.put('/profile/:clientId', upload.single('profilePicture'), profileController.editProfile);

module.exports = router;
