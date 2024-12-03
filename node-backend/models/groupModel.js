const firestore = require('../firestore');
const GROUPS_COLLECTION = 'groups';

exports.getGroupByName = async (groupName) => {
  const snapshot = await firestore.collection(GROUPS_COLLECTION)
    .where('groupName', '==', groupName)
    .get();
  return snapshot.empty ? null : snapshot.docs[0].data();
};

exports.addGroup = async (groupDetails) => {
  const docRef = firestore.collection(GROUPS_COLLECTION).doc(groupDetails.id);
  await docRef.set(groupDetails);
  return groupDetails.id;
};
