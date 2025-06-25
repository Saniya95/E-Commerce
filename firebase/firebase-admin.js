const admin = require("firebase-admin");

const serviceAccount = require("./firebase-admin-sdk.json"); // path to your downloaded service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
