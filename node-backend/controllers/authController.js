// authController.js
const nodemailer = require("nodemailer"); // Import nodemailer
const bcrypt = require("bcrypt");
const clientModel = require("../models/clientModel");
const groupModel = require("../models/groupModel");
const chatModel = require("../models/chatModel");
const { v4: uuidv4 } = require("uuid");
const SALT_ROUNDS = 10;
const axios = require("axios");
const friendRequestModel = require("../models/friendRequestModel");
const firestore =require('../firestore');
const GROUPS_COLLECTION = 'groups';


exports.signUp = async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    courseOfStudy,
    yearOfStudy,
    typeOfDegree,
    gender,
  } = req.body;
  const profilePicture = req.file;

  try {
    const existingUser = await clientModel.getClientByUsernameOrEmail(username, email);
    if (existingUser) {
      const conflictField = existingUser.username === username ? 'username' : 'email';
      return res.status(400).json({
        error: `User with this ${conflictField} already exists.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let profilePictureUrl = null;
    if (profilePicture) {
      profilePictureUrl = `data:${
        profilePicture.mimetype
      };base64,${profilePicture.buffer.toString("base64")}`;
    }

    const clientId = uuidv4();
    const newClient = {
      id: clientId,
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      courseOfStudy,
      yearOfStudy,
      typeOfDegree,
      gender,
      profilePictureUrl,
      friends: [],
      groups: [],
    };

    await clientModel.addClient(newClient);

    res.status(201).json({
      status: "success",
      clientId: newClient.id,
      message: "SignUp Successful",
      firstName: newClient.firstName,
      lastName: newClient.lastName,
      courseOfStudy: newClient.courseOfStudy,
      yearOfStudy: newClient.yearOfStudy,
      typeOfDegree: newClient.typeOfDegree,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login Endpoint
exports.logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use the newly created getClientByEmail function
    const client = await clientModel.getClientByEmail(email);
    if (!client || !(await bcrypt.compare(password, client.password))) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Send the clientId and status: success in the response
    res.status(200).json({
      clientId: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      courseOfStudy: client.courseOfStudy,
      yearOfStudy: client.yearOfStudy,
      typeOfDegree: client.typeOfStudy,
      status: "success",
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch Client Details by Username -(for getting a friend details in "connect with friends")
exports.getClientByUsername = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const clientDetails = await clientModel.getClientByUsername(username);

    if (!clientDetails) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      status: "success",
      clientDetails,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a Friend Request
exports.sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Validate request body
  if (!senderId || !receiverId) {
    return res.status(400).json({
      error: "Both senderId and receiverId are required in the request body.",
    });
  }

  try {
    // Ensure senderId and receiverId are not the same
    if (senderId === receiverId) {
      return res.status(400).json({
        error: "Cannot send a friend request to yourself.",
      });
    }

    // Verify sender and receiver exist
    const senderExists = await clientModel.getClientById(senderId);
    const receiverExists = await clientModel.getClientById(receiverId);

    if (!senderExists) {
      return res.status(404).json({ error: "Sender not found." });
    }
    if (!receiverExists) {
      return res.status(404).json({ error: "Receiver not found." });
    }

    // Check if a friend request already exists
    const pendingRequests = await friendRequestModel.getPendingRequests(receiverId);
    const alreadyRequested = pendingRequests.some(
      (request) => request.senderId === senderId
    );

    if (alreadyRequested) {
      return res.status(400).json({
        error: "Friend request already sent to this user.",
      });
    }

    // Prepare friend request data
    const requestData = {
      senderId: senderId.trim(),  // Ensure senderId is not undefined
      receiverId: receiverId.trim(),  // Ensure receiverId is not undefined
      createdAt: new Date().toISOString(),
    };

    // Store friend request in the receiver's subcollection
    const requestId = await friendRequestModel.createFriendRequest(requestData);

    return res.status(201).json({
      message: "Friend request sent successfully.",
      requestId,
    });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to create friend request: ${error.message}`,
    });
  }
};

// Accept a Friend Request
exports.acceptFriendRequest = async (req, res) => {
  const { requestId, clientId } = req.body; // Ensure clientId is passed along with requestId

  try {
    const result = await friendRequestModel.acceptFriendRequest(requestId, clientId); // Pass clientId
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Reject a Friend Request
exports.rejectFriendRequest = async (req, res) => {
  const { requestId, clientId } = req.body; // Ensure clientId is also passed

  try {
    const result = await friendRequestModel.rejectFriendRequest(requestId, clientId); // Pass clientId
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNewGroup = async (req, res) => {
  const {
    groupName,
    subject,
    date,
    time,
    location,
    groupDescription,
    friends,
    type,
    clientId,
  } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: 'Client ID is missing.' });
  }

  try {
    const existingGroup = await groupModel.getGroupByName(groupName);
    if (existingGroup) {
      return res.status(400).json({ error: 'Group with this name already exists.' });
    }

    // Fetch user's friends
    const userFriends = await clientModel.getFriendsList(clientId);

    // Validate each friend
    const invalidFriends = friends.filter((friend) => !userFriends.includes(friend));
    if (invalidFriends.length > 0) {
      return res.status(400).json({
        error: `The following users are not your friends: ${invalidFriends.join(', ')}`,
      });
    }

    const groupId = `G${uuidv4()}`;

    const newGroup = {
      id: groupId,
      groupName,
      subject,
      date,
      time,
      location,
      groupDescription,
      createdBy: clientId,
      members: [clientId],
      memberCount: 1,
    };

    if (friends && friends.length > 0) {
      newGroup.members = [...newGroup.members, ...friends];
    }

    if (type.toLowerCase() === 'online') {
      newGroup.zoomLink = `https://zoom.us/${uuidv4()}`;
    }

    await groupModel.addGroup(newGroup);

    for (const memberId of newGroup.members) {
      await clientModel.addGroupToClient(memberId, groupId);
    }

    res.status(201).json({
      message: 'Group created successfully',
      groupId,
      status: 'success',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getGroupDetails = async (req, res) => {
  const { groupId } = req.body;

  try {
    const groupDetails = await groupModel.getGroupById(groupId);
    if (!groupDetails) {
      return res.status(404).json({ error: 'Group not found.' });
    }
    res.status(201).json({
      groupDetails,
      status: 'success',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Join group ku search bar endpoint
exports.getGroups = async (req, res) => {
  const { searchTerm, filters } = req.body;

  try {
    let query = firestore.collection(GROUPS_COLLECTION);

    if (searchTerm && searchTerm.trim() !== '') {
      query = query.where('groupName', '==', searchTerm);
    }

    if (filters && Object.keys(filters).length > 0) {
      const { meetingType, time, location, subject, title } = filters;

      if (meetingType) {
        query = query.where('type', '==', meetingType);
      }
      if (time) {
        query = query.where('time', '==', time);
      }
      if (location) {
        query = query.where('locationLowercase', '==', location.toLowerCase());
      }
      if (subject) {
        query = query.where('subjectLowercase', '==', subject.toLowerCase());
      }
      if (title) {
        query = query.where('groupName', '==', title);
      }
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No groups found.' });
    }

    const groupDetails = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({
      groupDetails,
      status: 'success',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// searchFrends function in "create a group"
exports.searchFriends = async (req, res) => { 
  const { clientId, searchQuery } = req.body;

  // Validate input
  if (!clientId || typeof clientId !== 'string' || !clientId.trim()) {
    return res.status(400).json({ error: 'Client ID is missing or invalid.' });
  }

  if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
    return res.status(400).json({ error: 'Search query is missing or invalid.' });
  }

  try {
    // Fetch the user's friends list
    const userFriends = await clientModel.getFriendsList(clientId);
    if (!Array.isArray(userFriends) || userFriends.length === 0) {
      return res.status(404).json({ error: 'No friends found for the given client.' });
    }

    // Find the user by username (searchQuery)
    const matchedUser = await clientModel.getClientByUsername(searchQuery);
    if (!matchedUser) {
      return res.status(404).json({ error: `No user found with username matching "${searchQuery}".` });
    }

    // Check if the matched user is in the friend list
    const isFriend = userFriends.some(friend => friend.clientId === matchedUser.id);

    if (!isFriend) {
      return res.status(404).json({ error: `The user "${searchQuery}" is not in the friend list of the client.` });
    }

    // Return the matched user's details
    res.status(200).json({
      matchedFriend: {
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
        profilePicture: matchedUser.profilePicture || null,
      },
      status: 'success',
    });
  } catch (err) {
    console.error(`Error while searching friends: ${err.message}`);
    res.status(500).json({ error: `Failed to search friends: ${err.message}` });
  }
};

// Add members to a group
exports.addMemberToGroup = async (req, res) => {
  const { groupId, friends } = req.body;

  if (!groupId || !friends || !Array.isArray(friends) || friends.length === 0) {
    return res.status(400).json({
      error:
        "Invalid request. Provide a valid groupId and a non-empty array of friends.",
    });
  }

  try {
    const group = await groupModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    const existingMembers = group.members || [];
    const newMembers = friends.filter(
      (friend) => !existingMembers.includes(friend)
    );

    if (newMembers.length === 0) {
      return res.status(400).json({
        error: "All provided friends are already members of the group.",
      });
    }

    await groupModel.addMembersToGroup(groupId, newMembers);

    for (const friendId of newMembers) {
      await clientModel.addGroupToClient(friendId, groupId);
    }

    res
      .status(200)
      .json({ message: "Members added successfully.", newMembers });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error adding members to the group: ${err.message}` });
  }
};

// Delete Client Endpoint
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await clientModel.deleteClient(id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Client Endpoint
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    await clientModel.updateClient(id, updatedData);
    res.status(200).json({ message: "Client updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const { clients } = req.body;
    const clientDetails = await Promise.all(
      clients.map(async (clientId) => {
        const clientDetail = await clientModel.getClientById(clientId);
        return clientDetail;
      })
    );
    res.status(200).json({ status: "success", clientDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const { clientId } = req.body;
    const clientDetails = await clientModel.getClientById(clientId);
    res.status(200).json({ status: "success", clientDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Friend Endpoint (Add friends to user's friends list)
exports.addFriend = async (req, res) => {
  const { friendId } = req.body;
  const clientId = req.clientId;

  try {
    // Check if the friend is already in the client's friends list
    const client = await clientModel.getClientById(clientId);
    const friend = await clientModel.getClientById(friendId);

    if (!client || !friend) {
      return res.status(404).json({ error: "Client or friend not found." });
    }

    if (client.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ error: "This user is already your friend." });
    }

    // Add the friend to both clients' friends lists
    await clientModel.addFriendToClient(clientId, friendId);
    await clientModel.addFriendToClient(friendId, clientId);

    // Send success response
    res.status(200).json({ message: "Friend added successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


