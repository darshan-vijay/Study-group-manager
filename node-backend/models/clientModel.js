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

exports.addClient = async (data) => {
  const docRef = firestore.collection(CLIENTS_COLLECTION).doc(data.id);
  await docRef.set(data);
  return data.id;
};

exports.deleteClient = async (id) => {
  await firestore.collection(CLIENTS_COLLECTION).doc(id).delete();
};

exports.updateClient = async (id, data) => {
  await firestore.collection(CLIENTS_COLLECTION).doc(id).update(data);
};
