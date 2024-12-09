const firestore = require('../firestore');
const { arrayUnion, increment } = require('firebase-admin').firestore.FieldValue;

const GROUPS_COLLECTION = 'groups';

exports.addGroup = async (groupData) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupData.id);
  await groupRef.set(groupData);
};

exports.getGroupByName = async (groupName) => {
  const snapshot = await firestore.collection(GROUPS_COLLECTION)
    .where('groupName', '==', groupName)
    .get();

  return snapshot.empty ? null : snapshot.docs[0].data();
};

exports.updateGroupMemberCount = async (groupId) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);
  const groupSnapshot = await groupRef.get();

  if (!groupSnapshot.exists) {
    throw new Error('Group not found.');
  }

  const groupData = groupSnapshot.data();
  const memberCount = groupData.members.length;
  await groupRef.update({ memberCount });
};

exports.addMembersToGroup = async (groupId, newMembers) => {
  try {
    const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);

    await groupRef.update({
      members: arrayUnion(...newMembers),
      memberCount: increment(newMembers.length),
    });
  } catch (error) {
    throw new Error(`Error updating group members: ${error.message}`);
  }
};

exports.getGroupById = async (groupId) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);
  const groupSnapshot = await groupRef.get();

  if (!groupSnapshot.exists) {
    return null;
  }

  return groupSnapshot.data();
};
