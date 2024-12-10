const clientModel = require("../models/clientModel");
// Profile editing and view the profile
exports.viewProfile = async (req, res) => {
  const { clientId } = req.params;

  if (!clientId) {
    return res.status(400).json({ error: "Client ID is required." });
  }

  try {
    const client = await clientModel.getClientById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.status(200).json({
      clientId: client.id,
      username: client.username,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      courseOfStudy: client.courseOfStudy,
      yearOfStudy: client.yearOfStudy,
      typeOfDegree: client.typeOfDegree,
      gender: client.gender,
      profilePictureUrl: client.profilePictureUrl,
    });
  } catch (error) {
    res.status(500).json({ error: `Error fetching profile: ${error.message}` });
  }
};

exports.editProfile = async (req, res) => {
  const { clientId } = req.params;
  const {
    username,
    email,
    firstName,
    lastName,
    courseOfStudy,
    yearOfStudy,
    typeOfDegree,
    gender,
  } = req.body;
  const profilePicture = req.file;

  if (!clientId) {
    return res.status(400).json({ error: "Client ID is required." });
  }

  try {
    const client = await clientModel.getClientById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found." });
    }

    const existingClient = await clientModel.getClientByUsernameOrEmail(username, email);
    if (existingClient && existingClient.id !== clientId) {
      const conflictField = existingClient.username === username ? 'username' : 'email';
      return res.status(400).json({
        error: `User with this ${conflictField} already exists.`,
      });
    }

    // Create the updated client object, explicitly ignoring undefined values
    const updatedClient = Object.fromEntries(
      Object.entries({
        username,
        email,
        firstName,
        lastName,
        courseOfStudy,
        yearOfStudy,
        typeOfDegree,
        gender,
        profilePictureUrl: profilePicture
          ? `data:${profilePicture.mimetype};base64,${profilePicture.buffer.toString("base64")}`
          : client.profilePictureUrl,
      }).filter(([_, value]) => value !== undefined)
    );

    // Update client in Firestore
    await clientModel.updateClient(clientId, updatedClient);

    res.status(200).json({
      message: "Profile updated successfully.",
      clientId,
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating profile: ${error.message}` });
  }
};
