// authroutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require("../controllers/authController");


const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

// Routes
router.post(
  "/register",
  upload.single("profilePicture"),
  authController.signUp
);

// Route for user login
router.post('/login', authController.logIn);

// Route for sending a friend request
router.post('/send-friend-request', authController.sendFriendRequest);

// Route for accepting a friend request
router.post('/accept-friend-request', authController.acceptFriendRequest);

// Route for rejecting a friend request
router.post('/reject-friend-request', authController.rejectFriendRequest);



router.post('/get-pending-requests', authController.getPendingRequests);


module.exports = router;



 