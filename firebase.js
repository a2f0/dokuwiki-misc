#!/usr/bin/env node

// Fetch the service account key JSON file contents

var admin = require("firebase-admin");
var serviceAccount = require("./api_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tagstack-21c6b.firebaseio.com/"
});

// Get a database reference to our items
var db = admin.database();
var ref = db.ref("todoApp/items");

// Attach an asynchronous callback to read the data.
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

