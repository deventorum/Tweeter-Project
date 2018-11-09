"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    if (req.body.text.length > 140) {
      res.status(400).json({ error: 'Tweet is too long to be posted'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweet);
      }
    });
  });

  tweetsRoutes.post("/login", function(req, res) {
    const loginName = req.body.handle;
    const loginPassword = req.body.password;
    
    console.log(req.body);
    DataHelpers.checkUser(loginName, (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      
      if (loginName === user.handle) {
        if (parseInt(loginPassword) === user.password) {
        }
      }
    })
  })

  tweetsRoutes.post("/registration", function(req, res) {
    const newUser = {
      "name": req.body.userName,
      "handle": req.body.handle,
      "password": req.body.password
    }
    DataHelpers.addUser(newUser, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(newUser);
      }
    })
    console.log('registration')
  })

  tweetsRoutes.post("/login", function(req, res) {
    console.log('login');
  })

  tweetsRoutes.post("/logout", function(req, res) {
    console.log('logout');
  })

  return tweetsRoutes;

}
