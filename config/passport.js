var JwtStrategy = require('passport-jwt').Strategy;
 
// load up the user model
var User = require('../models/user');
var config = require('../config/database'); // get db config file
 
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	  console.log('inside passport use');
	     User.findOne({id: jwt_payload.id}, function(err, user) {
    	   console.log('inside find of use of passport');
          if (err) {
              return done(err, false);
          }
          if (user) {
            console.log('return passport user');
        	  console.log(user);
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};