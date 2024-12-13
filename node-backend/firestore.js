const admin = require("firebase-admin");

// Path to your service account key file (use the path where you downloaded the Firebase private key JSON)
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
module.exports = firestore;
