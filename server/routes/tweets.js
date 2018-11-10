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


    // User can post a tweet using logged information 
    DataHelpers.getUser(req.session['userID'], (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // cretes tweet element that will be passed to ajax
        const tweet = {
          user: user,
          content: {
            text: req.body.text
          },
          created_at: Date.now()
        };
        
        // passes tweet to be rendered
        DataHelpers.saveTweet(tweet, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json(tweet);
          }
        });

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
        if (parseInt(loginPassword) === parseInt(user.password)) {
          req.session['userID'] = req.body.handle;
          res.redirect('/');
        }
      }
    })
    
  })

  tweetsRoutes.post("/registration", function(req, res) {
    const newUser = {
      "name": req.body.userName,
      "handle": req.body.handle,
      "password": req.body.password,
      "avatars": userHelper.generateAvatars(req.body.handle)
    }
    DataHelpers.addUser(newUser, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.redirect("/");
      }
    })
    console.log('registration')
  })

  tweetsRoutes.post("/logout", function(req, res) {
    console.log('logout');
    req.session = null;
    res.redirect('/');
  })

  tweetsRoutes.get("/verify", function(req, res) {
    if (req.session['userID']) {
      DataHelpers.checkUser(req.session['userID'], (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
        }
        // sends back user object to ajax
        if (user) {
          res.json({
            "name" : user.name,
            "handle": user.handle,
            "validity": true
          })
          res.status(200);
        }
      })
      
    } else {
      res.json({
        "validity": false
      })
      res.status(400);
    }
  })

  return tweetsRoutes;

}
