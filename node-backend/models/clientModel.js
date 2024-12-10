// clientModel.js
const firestore = require('../firestore');
const CLIENTS_COLLECTION = 'clients';

// Add a method to get client by email
exports.getClientByEmail = async (email) => {
  const emailSnapshot = await firestore.collection(CLIENTS_COLLECTION)
    .where('email', '==', email)
    .get();
  return emailSnapshot.empty ? null : emailSnapshot.docs[0].data();
};

// Add a method to get client by username or email
exports.getClientByUsernameOrEmail = async (username, email) => {
  const snapshot = await firestore.collection(CLIENTS_COLLECTION)
    .where('username', '==', username)
    .get();

  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }

  const emailSnapshot = await firestore.collection(CLIENTS_COLLECTION)
    .where('email', '==', email)
    .get();

  return emailSnapshot.empty ? null : emailSnapshot.docs[0].data();
};

// Add a new client to the database
exports.addClient = async (clientData) => {
  const clientRef = firestore.collection(CLIENTS_COLLECTION).doc(clientData.id);
  await clientRef.set(clientData);
};

// Delete a client by their ID
exports.deleteClient = async (id) => {
  await firestore.collection(CLIENTS_COLLECTION).doc(id).delete();
};

// Update client data by their ID
exports.updateClient = async (id, data) => {
  await firestore.collection(CLIENTS_COLLECTION).doc(id).update(data);
};

// Get a client by their ID
exports.getClientById = async (clientId) => {
  const clientRef = firestore.collection(CLIENTS_COLLECTION).doc(clientId);
  const clientSnapshot = await clientRef.get();
  
  return clientSnapshot.exists ? clientSnapshot.data() : null;
};

// Add a friend to a client's friends list
exports.addFriendToClient = async (clientId, friendId) => {
  const clientRef = firestore.collection(CLIENTS_COLLECTION).doc(clientId);
  const clientSnapshot = await clientRef.get();
  const clientData = clientSnapshot.data();
  
  if (!clientData.friends) {
    clientData.friends = [];
  }

  if (!clientData.friends.includes(friendId)) {
    clientData.friends.push(friendId);
    await clientRef.update({ friends: clientData.friends });
  }
};

// Add a group to a client's groups list
exports.addGroupToClient = async (clientId, groupId) => {
  const clientRef = firestore.collection(CLIENTS_COLLECTION).doc(clientId);
  const clientSnapshot = await clientRef.get();
  const clientData = clientSnapshot.data();
  
  if (!clientData.groups) {
    clientData.groups = [];
  }

  if (!clientData.groups.includes(groupId)) {
    clientData.groups.push(groupId);
    await clientRef.update({ groups: clientData.groups });
  }
};

// Get all friends of a client
exports.getFriends = async (clientId) => {
  const snapshot = await firestore.collection(CLIENTS_COLLECTION)
    .where('friends', 'array-contains', clientId)
    .get();
  return snapshot.docs.map(doc => doc.data());
};

// Get all clients that are in a particular group (using groupId)
exports.getClientsByGroupId = async (groupId) => {
  const snapshot = await firestore.collection(CLIENTS_COLLECTION)
    .where('groups', 'array-contains', groupId)
    .get();
  return snapshot.docs.map(doc => doc.data());
};

// Get Client by Username
exports.getClientByUsername = async (username) => {
  if (!username || typeof username !== 'string' || !username.trim()) {
    throw new Error('Invalid username.');
  }

  const snapshot = await firestore.collection(CLIENTS_COLLECTION)
    .where('username', '==', username)
    .get();

  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

exports.getFriendsList = async (clientId) => {
  const clientRef = firestore.collection(CLIENTS_COLLECTION).doc(clientId);
  const clientSnapshot = await clientRef.get();

  if (!clientSnapshot.exists) {
    throw new Error('Client not found.');
  }

  const clientData = clientSnapshot.data();
  return Array.isArray(clientData.friends) ? clientData.friends : [];
};

