// authController.js
const nodemailer = require("nodemailer"); // Import nodemailer
const bcrypt = require("bcrypt");
const clientModel = require("../models/clientModel");
const groupModel = require("../models/groupModel");
const chatModel = require("../models/chatModel");
const { v4: uuidv4 } = require("uuid");
const SALT_ROUNDS = 10;
const axios = require("axios");

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
    const existingUser = await clientModel.getClientByUsernameOrEmail(
      username,
      email
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let profilePictureUrl = null;
    if (profilePicture) {
      profilePictureUrl = `data:${
        profilePicture.mimetype
      };base64,${profilePicture.buffer.toString("base64")}`;
    }

    const clientId = uuidv4(); // Generate a unique client ID
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
      friends: [], // Initialize friends array
      groups: [], // Initialize groups array
    };

    await clientModel.addClient(newClient);

    // Send both clientId and status: success in the response
    res.status(201).json({
      status: "success",
      clientId: newClient.id,
      message: "SignUp Successful",
      firstName: client.firstName,
      lastName: client.lastName,
      courseOfStudy: client.courseOfStudy,
      yearOfStudy: client.yearOfStudy,
      typeOfDegree: client.typeOfStudy,
    });
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
