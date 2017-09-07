var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');

// Handles request for HTML file
router.get('/', function(req, res, next) {
  console.log('get /register route');
  res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
});

// Handles POST request with new user data
// Handles POST request with new user data
router.post('/', function(req, res, next) {

  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password),
    staff_id: req.body.staff_id
  };
  console.log('new user:', saveUser);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("INSERT INTO users (username, password, staff_id) VALUES ($1, $2, $3) RETURNING id",
      [saveUser.username, saveUser.password, saveUser.staff_id],
        function (err, result) {
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            //next(err);
          } else {
            res.redirect('/');
          }
        });
  });

});

router.post('/check', function(req, res, next) {
  console.log('checking existing username', req.body);
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("SELECT email, id FROM staff WHERE email ilike $1 limit 1;",
      [req.body.username],
        function (err, result) {
          done();
          if(err) {
            console.log("Error getting data", err);
            //next(err);
          } else {
            console.log(result.rows[0]);
            res.send(result.rows);
          }
        });
  });
});


module.exports = router;
