// authController.js
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const clientModel = require('../models/clientModel');
const { v4: uuidv4 } = require('uuid');
const SALT_ROUNDS = 10;

exports.signUp = async (req, res) => {
  const { username, email, password, firstName, lastName, courseOfStudy, yearOfStudy, typeOfDegree, gender } = req.body;
  const profilePicture = req.file;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await clientModel.getClientByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let profilePictureUrl = null;
    if (profilePicture) {
      profilePictureUrl = `data:${profilePicture.mimetype};base64,${profilePicture.buffer.toString('base64')}`;
    }

    const clientId = await clientModel.addClient({
      id: uuidv4(),
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
    });

    res.status(201).json({ message: 'Sign-up successful', clientId });
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
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    res.status(200).json({ message: 'Login successful', client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create New Group Endpoint
exports.createNewGroup = async (req, res) => {
  const { groupName, typeOfStudy, ...groupDetails } = req.body;

  try {
    const existingGroup = await groupModel.getGroupByName(groupName);
    if (existingGroup) {
      return res.status(400).json({ error: 'Group with this name already exists.' });
    }

    const groupId = uuidv4();
    const newGroup = { id: groupId, groupName, typeOfStudy, ...groupDetails };

    if (typeOfStudy.toLowerCase() === 'online') {
      newGroup.zoomLink = `https://zoom.us/${uuidv4()}`;
    }

    await groupModel.addGroup(newGroup);
    res.status(201).json({ message: 'Group created successfully', groupId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Client Endpoint
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await clientModel.deleteClient(id);
    res.status(200).json({ message: 'Client deleted successfully' });
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
    res.status(200).json({ message: 'Client updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
