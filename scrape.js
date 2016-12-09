#!/usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
console.log("starting...");

request('https://dansullivan.io/wiki/doku.php?id=command_reference', 
  function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('h2').each(function(i, element){
        var sectiontitle = $(this).text();
        var nxt = $(this).next();
        nxt.children().each(function(i, element){
          //console.log("BEGIN i" + i + " " + $(this).text() + " END i " + i);
          if ( $(this).is( "p") ) {
            console.log("it is a p tag");
          };
        });
        //console.log(sectiontitle); 
        //console.log("  child begin");
        //console.log("  " + nxt.text());
        //console.log("  child end");
      });
    }
});
