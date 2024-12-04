const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

// Routes
router.post('/register', upload.single('profilePicture'), validationMiddleware.validateSignUp, authController.signUp);
router.post('/login', validationMiddleware.validateLogIn, authController.logIn);
router.delete('/delete/:id', authController.deleteClient);
router.post('/create-group', validationMiddleware.validateCreateGroup, authController.createNewGroup);

module.exports = router;
