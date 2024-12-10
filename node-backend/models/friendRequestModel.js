const firebaseAdmin = require('firebase-admin');
const db = firebaseAdmin.firestore(); // Use Firebase Firestore

// Create a friend request (send a request)
exports.createFriendRequest = async (requestData) => {
  try {
    const { senderId, receiverId } = requestData;

    if (!senderId || !receiverId) {
      throw new Error('Invalid data: senderId and receiverId are required.');
    }

    const friendRequest = {
      senderId,
      receiverId,
      status: 'pending', // pending, accepted, rejected
      timestamp: new Date().toISOString(),
    };

    // Add the friend request as a subcollection under the receiver's client document
    const receiverRef = db.collection('clients').doc(receiverId);
    const friendRequestRef = receiverRef.collection('friendRequests').doc(); // Auto-generate doc ID
    await friendRequestRef.set(friendRequest);

    return friendRequestRef.id; // Return the request ID
  } catch (error) {
    throw new Error(`Failed to create friend request: ${error.message}`);
  }
};

// Get pending friend requests for a client (receiver)
exports.getPendingRequests = async (clientId) => {
  try {
    const snapshot = await db
      .collection('clients')
      .doc(clientId)
      .collection('friendRequests')  // Subcollection under the client document
      .where('status', '==', 'pending')
      .get();

    if (snapshot.empty) {
      return []; // No pending requests
    }

    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return requests;
  } catch (error) {
    throw new Error(`Failed to get pending requests: ${error.message}`);
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (requestId, clientId) => {
  try {
    // Make sure both clientId and requestId are present in the path
    const requestRef = db.collection('clients').doc(clientId).collection('friendRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      throw new Error('Request not found.');
    }

    const requestData = requestDoc.data();
    if (requestData.status === 'accepted') {
      throw new Error('Request already accepted.');
    }

    // Update request status to accepted
    await requestRef.update({ status: 'accepted' });

    // Add the user to each other's friends list
    const { senderId, receiverId } = requestData;
    await addFriendToClient(senderId, receiverId);
    await addFriendToClient(receiverId, senderId);

    return 'Friend request accepted successfully.';
  } catch (error) {
    throw new Error(`Failed to accept friend request: ${error.message}`);
  }
};

// Reject a friend request
exports.rejectFriendRequest = async (requestId, clientId) => {
  try {
    // Construct the correct document path using both clientId and requestId
    const requestRef = db.collection('clients').doc(clientId).collection('friendRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      throw new Error('Request not found.');
    }

    // Update the request status to rejected
    await requestRef.update({ status: 'rejected' });

    return 'Friend request rejected successfully.';
  } catch (error) {
    throw new Error(`Failed to reject friend request: ${error.message}`);
  }
};

// Helper function to add friend to client's friends list
const addFriendToClient = async (clientId, friendId) => {
  try {
    const clientRef = db.collection('clients').doc(clientId);
    const clientDoc = await clientRef.get();

    if (!clientDoc.exists) {
      throw new Error('Client not found.');
    }

    const clientData = clientDoc.data();
    const currentFriends = clientData.friends || [];

    // Check if already friends
    if (!currentFriends.some(friend => friend.clientId === friendId)) {
      currentFriends.push({ clientId: friendId });
      await clientRef.update({ friends: currentFriends });
    }
  } catch (error) {
    throw new Error(`Failed to add friend to client: ${error.message}`);
  }
};
