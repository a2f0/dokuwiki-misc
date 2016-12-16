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
var ref = db.ref("tagstack/items");

// Attach an asynchronous callback to read the data.
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//http://stackoverflow.com/questions/37405149/how-do-i-check-if-a-firebase-database-value-exists

var ref2 = db.ref();

ref2.once("value", function(snapshot) {
  var a = snapshot.exists();
  console.log("exists");
  //var a = snapshot.exists();
  if (snapshot.hasChild("todoApp")) {
    console.log("child exists");
  } else {
    console.log("child doesnt exist");
  }
    //  print("yes, items exist")
    //} else {
    //  print("false room doesn't exist")
    //}
  //})
});
