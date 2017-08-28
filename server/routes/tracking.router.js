var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

  // function getLocation(req, res){
  //   pool.connect(function(err, client, done, next) {
  //     if(err) {
  //       console.log("Error connecting: ", err);
  //     }
  //     var location;
  //     client.query("select location from staff join users on staff.id = users.staff_id where users.id = "+ req.user.id+";",
  //         function (err, result) {
  //           client.end();
  //           done();
  //           if(err) {
  //             console.log("Error inserting data: ", err);
  //             next(err);
  //           } else {
  //             console.log('location', result.rows[0].location);
  //             location = result.rows[0].location;
  //
  //           }
  //         });
  //   });
  //   return location;
  // }

router.get('/getClients', function(req, res) {
  console.log('in server getting dem clients');
  console.log('CURRENT USER ID', req.user.id);

  //start getLocation
  //  console.log(getLocation(req, res));
  //  var location = getLocation(req, res);
  //  console.log('LOCATION', location);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("select client.id, client.name, client.staff_id from client join staff on staff.id = client.staff_id join users on users.staff_id = staff.id where users.id = "+ req.user.id +";",
        function (err, result) {
          client.end();
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            //next(err);
          } else {
            console.log('RESULT ROWS', result.rows);
            res.send(result.rows);
          }
        });
  });
});

router.get('/getGoals', function(req, res) {
  console.log('in server getting dem goals', req.body);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("SELECT id, name FROM client",
        function (err, result) {
          client.end();
          client.done();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            console.log('RESULT ROWS', result.rows);
            res.send(result.rows);
          }
    });
  });
});




module.exports = router;
