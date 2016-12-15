#!/usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');

/* firebase initialization begin */
var admin = require("firebase-admin");
var serviceAccount = require("./api_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tagstack-21c6b.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("tagstack/tags");
/* firebase initialization end */

// Attach an asynchronous callback to read the data.
//ref.on("value", function(snapshot) {
//  console.log(snapshot.val());
//, function (errorObject) {
//  console.log("The read failed: " + errorObject.code);
//});

request('https://dansullivan.io/wiki/doku.php?id=command_reference', 
  function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('h2').each(function(i, element){
        var sectiontitle = $(this).text();
        var nxt = $(this).next();
        nxt.children().each(function(i, element){
          //console.log("BEGIN i" + i + " " + $(this).text() + " END i " + i);
          if ( $(this).is("p") ) {
            var should_be_pre = $(this).next();
            if ( should_be_pre.is("pre") ) {
              //then we have tag, title, and snippet
              //console.log(sectiontitle + " value: " + $(this).text());
              console.log(sectiontitle + " value: " + $(this).text().replace(/\n/g, ""));
              console.log("pre: " + should_be_pre.text());
            }
          };
        });
        //console.log(sectiontitle); 
        //console.log("  child begin");
        //console.log("  " + nxt.text());
        //console.log("  child end");
      });
    }
});
