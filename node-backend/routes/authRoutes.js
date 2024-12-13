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
router.post("/get-pending-requests", authController.getPendingRequests);

// Route for user login
router.post("/login", authController.logIn);

// Route for searching users by username
router.post("/search-users", authController.getClientByUsername);

// Route for sending a friend request
router.post("/send-friend-request", authController.sendFriendRequest);

// Route for accepting a friend request
router.post("/accept-friend-request", authController.acceptFriendRequest);

// Route for rejecting a friend request
router.post("/reject-friend-request", authController.rejectFriendRequest);

// Route for getting group details
router.post("/group-details", authController.getGroupDetails);

// Route for getting all groups
router.post("/get-groups", authController.getGroups);

// Route for creating a new group
router.post("/create-group", authController.createNewGroup);

// Route for adding members to a group
router.post("/add-member-to-group", authController.addMemberToGroup);

// Route for adding a friend
router.post("/add-friend", authController.addFriend);

// Route for updating client information
router.put("/update-client/:id", authController.updateClient);

// Route for deleting a client
router.delete("/delete-client/:id", authController.deleteClient);

// Route for getting a list of clients' details
router.post("/get-clients", authController.getClients);

// Route for getting details of a specific client
router.post("/get-client", authController.getClient);
// create group page la search bar
router.post("/searchfriends", authController.searchFriends);

// gets the groups related to a client
router.post("/get-client-groups", authController.getGroupsForClient);

// gets the groups related to a client
router.post("/join-group", authController.joinGroup);

module.exports = router;
