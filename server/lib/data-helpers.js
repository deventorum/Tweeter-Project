"use strict";

// Simulates the kind of delay we see with network or filesystem operations

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().sort({created_at: 1}).toArray(callback);
    },

    addUser: function(newUser, callback) {
      db.collection("users").insertOne(newUser);
      callback(null, true);
    },

    checkUser: function(handle, callback) {
      db.collection("users").findOne({'handle':handle}).then((data)=>{
        callback(null, data);
      });
    },
    // returns user information necessary only to post tweet
    getUser: function(handle, callback) {
      db.collection("users").findOne({'handle':handle}, { _id: 0, password: 0 }).then((data)=>{
        callback(null, data);
      });
    }

  };
}
