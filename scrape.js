#!/usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
console.log("starting...");

request('https://dansullivan.io/wiki/doku.php?id=command_reference', 
  function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('h2').each(function(i, element){
        console.log($(this).text());
      });
    }
});
