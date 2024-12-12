const firestore = require("../firestore");
const { arrayUnion, increment } =
  require("firebase-admin").firestore.FieldValue;

const GROUPS_COLLECTION = "groups";

exports.addGroup = async (groupData) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupData.id);
  await groupRef.set(groupData);
};

exports.getGroupByName = async (groupName) => {
  const snapshot = await firestore
    .collection(GROUPS_COLLECTION)
    .where("groupName", "==", groupName)
    .get();

  return snapshot.empty ? null : snapshot.docs[0].data();
};

exports.updateGroupMemberCount = async (groupId) => {
  const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);
  const groupSnapshot = await groupRef.get();

  if (!groupSnapshot.exists) {
    throw new Error("Group not found.");
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
  try {
    const groupRef = firestore.collection(GROUPS_COLLECTION).doc(groupId);
    const groupDoc = await groupRef.get();
    return groupDoc.exists ? groupDoc.data() : null;
  } catch (error) {
    throw new Error(`Error retrieving group: ${error.message}`);
  }
};

// Method to get a group by its ID
exports.getAllGroups = async () => {
  try {
    const groupRef = firestore.collection(GROUPS_COLLECTION);
    const groupSnapshot = await groupRef.get();

    if (groupSnapshot.empty) {
      return []; // No groups found
    }

    // Extract data from all documents
    const allGroups = groupSnapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID if needed
      ...doc.data(), // Spread the document data
    }));

    return allGroups;
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    throw new Error("Failed to fetch groups");
  }
};
