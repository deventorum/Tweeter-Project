"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
const bcrypt = require('bcrypt');

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

    DataHelpers.checkUser(loginName, (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      }
      if (user) {
        if (bcrypt.compareSync(loginPassword, user.password)) {
          req.session['userID'] = req.body.handle;
          res.redirect('/');
        } else {
          // redirects back to homepage if password doesn't match
          res.redirect('/')
        }
      } else {
        // if there is no existing user with this name 
        res.redirect('/')
      }
    })
    
  })

  tweetsRoutes.post("/registration", function(req, res) {
    // checks for the length of the content
    if (req.body.userName.length <= 15 && req.body.handle.length <= 15 && req.body.password.length <= 15) {
      const newUser = {
        "name": req.body.userName,
        "handle": req.body.handle,
        "password": bcrypt.hashSync(req.body.password, 10),
        // avatars are randomly generated
        "avatars": userHelper.generateAvatars(req.body.handle)
      }
      DataHelpers.addUser(newUser, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          // creates a session right away
          req.session['userID'] = req.body.handle;
          res.redirect("/");
        }
      })
    } else {
      res.redirect("/");
    }
  })

  // simply deletes cookie session
  tweetsRoutes.post("/logout", function(req, res) {
    req.session = null;
    res.redirect('/');
  })

  tweetsRoutes.get("/verify", function(req, res) {
    if (req.session['userID']) {
      DataHelpers.checkUser(req.session['userID'], (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
        }
        if (user) {
          // sends back user handle to ajax
          res.json({
            "handle": user.handle,
            "validity": true
          })
          res.status(200);
        }
      })
      
    } else {
      // sends back info that validation was unsuccesful
      res.json({
        "validity": false
      })
      res.status(400);
    }
  })

  return tweetsRoutes;

}
