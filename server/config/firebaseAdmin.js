var admin = require("firebase-admin");
require("dotenv").config()
var serviceAccount = require("../config/sih24.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:process.env.FIREBASE_BUCKET
});

const bucket = admin.storage().bucket();

module.exports={admin,bucket}