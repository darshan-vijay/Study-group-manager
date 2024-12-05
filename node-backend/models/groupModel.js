// groupModel.js
const firestore = require('../firestore');
const { arrayUnion } = require('firebase-admin').firestore.FieldValue;

const GROUPS_COLLECTION = 'groups';

// Method to create a new group
exports.addGroup = async (groupData) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupData.id);
  await groupRef.set(groupData);
};

// Method to get a group by its name (to avoid duplication)
exports.getGroupByName = async (groupName) => {
  const snapshot = await firestore.collection(GROUPS_COLLECTION)
    .where('groupName', '==', groupName)
    .get();

  return snapshot.empty ? null : snapshot.docs[0].data();
};

// Method to update the group's member count
exports.updateGroupMemberCount = async (groupId) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);
  const groupSnapshot = await groupRef.get();
  const groupData = groupSnapshot.data();

  const memberCount = groupData.members.length;
  await groupRef.update({ memberCount });
};

// Method to add members to a group
exports.addMembersToGroup = async (groupId, newMembers) => {
  try {
    const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);

    // Add new members to the existing array
    await groupRef.update({
      members: arrayUnion(...newMembers), // Use Firestore's arrayUnion
      memberCount: admin.firestore.FieldValue.increment(newMembers.length), // Increment the count
    });
  } catch (error) {
    throw new Error(`Error updating group members: ${error.message}`);
  }
};

// Method to get a group by its ID
exports.getGroupById = async (groupId) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);
  const groupSnapshot = await groupRef.get();

  if (!groupSnapshot.exists) {
    return null; // Group not found
  }

  return groupSnapshot.data();
};
