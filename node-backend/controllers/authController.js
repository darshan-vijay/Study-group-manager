// authController.js
const nodemailer = require("nodemailer"); // Import nodemailer
const bcrypt = require("bcrypt");
const { Storage } = require("@google-cloud/storage");
const clientModel = require("../models/clientModel");
const groupModel = require("../models/groupModel");
const chatModel = require("../models/chatModel");
const friendRequestModel = require("../models/friendRequestModel");
const { v4: uuidv4 } = require("uuid");
const SALT_ROUNDS = 10;
const axios = require("axios");
const storage = new Storage({
  keyFilename: "./config/firebase-service-account.json", // Ensure this file exists in the config directory
});
const amqp = require("amqplib");


// RabbitMQ Configuration
let channel;
const queueName = "profilePictureQueue";

// Initialize RabbitMQ Connection
(async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672"); // Replace with your RabbitMQ URL
    channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log("RabbitMQ initialized, queue:", queueName);
  } catch (error) {
    console.error("RabbitMQ connection error:", error.message);
  }
})();

// Publish a Task to RabbitMQ
const publishToRabbitMQ = async (message) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log("Message published to RabbitMQ:", message);
  } catch (error) {
    console.error("Error publishing to RabbitMQ:", error.message);
  }
};


exports.getGroupDetails = async (req, res) => {
  const { groupId } = req.body;

  try {
    const groupDetails = await groupModel.getGroupById(groupId);
    // Send the response
    res.status(201).json({
      groupDetails,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get Groups for a team
exports.getGroups = async (req, res) => {
  const { clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: "Client ID is missing." });
  }

  try {
    // Fetch client details
    const clientDetails = await clientModel.getClientById(clientId);

    // Resolve all group details in parallel using Promise.all
    const groupDetails = await Promise.all(
      clientDetails.groups.map(async (groupId) => {
        const groupDetail = await groupModel.getGroupById(groupId);
        return groupDetail;
      })
    );

    // Send the response
    res.status(201).json({
      groupDetails: groupDetails,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create New Group Endpoint
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
    return res.status(400).json({ error: "Client ID is missing." });
  }

  try {
    const existingGroup = await groupModel.getGroupByName(groupName);
    if (existingGroup) {
      return res
        .status(400)
        .json({ error: "Group with this name already exists." });
    }

    // Generate unique Group ID starting with 'G'
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
      members: [clientId], // Add creator as a member
      memberCount: 1, // Initial count with creator
    };

    // Add selected friends to the group (if any)
    if (friends && friends.length > 0) {
      newGroup.members = [...newGroup.members, ...friends];
    }

    // If the group is online, generate Zoom link
    if (subject.toLowerCase() === "online") {
      newGroup.zoomLink = `https://zoom.us/${uuidv4()}`;
    }

    // Save group data
    await groupModel.addGroup(newGroup);

    // Add group ID to the members' client records
    for (let memberId of newGroup.members) {
      await clientModel.addGroupToClient(memberId, groupId);
    }

    res.status(201).json({
      message: "Group created successfully",
      groupId,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add members to a group (other clients can join)
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

// Sign-Up Endpoint with RabbitMQ Integration
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
    if (!profilePicture) {
      return res.status(400).json({ error: "Profile picture is required." });
    }
    console.log("File received:", profilePicture);

    // Check if user already exists
    const existingUser = await clientModel.getClientByUsernameOrEmail(
      username,
      email
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this username or email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Prepare user data and task for RabbitMQ
    const clientId = uuidv4();
    const message = {
      clientId,
      profilePicture: {
        buffer: profilePicture.buffer.toString("base64"), // Encode to Base64
        mimetype: profilePicture.mimetype,
        originalname: profilePicture.originalname,
      },
      userData: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        courseOfStudy,
        yearOfStudy,
        typeOfDegree,
        gender,
      },
    };

    // Publish the task to RabbitMQ
    await publishToRabbitMQ(message);

    res.status(202).json({
      status: "success",
      message: "Sign-up request received. Processing...",
      clientId,
    });
  } catch (error) {
    console.error("Sign-up error:", error.message);
    res.status(500).json({ error: error.message });
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




exports.getPendingRequests = async (req, res) => {
  const { clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: "Client ID is required." });
  }

  try {
    // Fetch pending friend requests
    const pendingRequests = await friendRequestModel.getPendingRequests(clientId);

    // Fetch sender details for each friend request
    const requestsWithSenderDetails = await Promise.all(
      pendingRequests.map(async (request) => {
        const senderDetails = await clientModel.getClientById(request.senderId);
        return {
          ...request,
          senderName: `${senderDetails.firstName} ${senderDetails.lastName}`,
          senderEmail: senderDetails.email,
        };
      })
    );

    res.status(200).json({
      status: "success",
      friendRequests: requestsWithSenderDetails,
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to get pending requests: ${error.message}` });
  }
};
