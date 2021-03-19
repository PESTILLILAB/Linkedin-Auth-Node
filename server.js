const express = require('express');
const app =express();
const session = require('express-session');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const routes = require('./routes.js');
const config = require('./config')
const fs = require('fs');
const YAML = require('yaml');



app.set('view engine', 'ejs');


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  
  passport.use(new LinkedInStrategy({
    clientID: config.linkedinAuth.clientID,
    clientSecret: config.linkedinAuth.clientSecret,
    callbackURL: config.linkedinAuth.callbackURL,
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, function (token, tokenSecret, profile, done) {
    var test = "---\nname : "+profile.displayName+"\nid : "+profile.id+"\nimage :"+profile.photos[profile.photos.length - 1].value+"\n---"
    
    try {
      const data = fs.writeFileSync('/home/ubuntu/plab/plab.hugo/content/team/'+profile.id+'.md', test, { flag: 'w+' })
      //file written successfully
    } catch (err) {
      console.error(err)
    }


    return done(null, profile);
  }
  ));
  
  app.use('/', routes);
  
  const port = 3000;
  
  app.listen(port, () => {
    console.log('App listening on port ' + port);
  });