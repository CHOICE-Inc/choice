var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

// Defining values for user roles
var ADMIN = 1;
var CASE = 2;

/*---- GET routes -----*/
  router.get('/getClients', function(req, res) {
    console.log('in server getting clients');

    if(req.user.role == ADMIN){
      pool.connect(function(err, client, done, next) {
        if(err) {
          console.log("Error connecting: ", err);
          next(err);
        }

        client.query("select client.id as clientid, staff_id, client_name, staff_name, active from client join staff on (client.staff_id = staff.id) order by active DESC, client_name;",
            function (err, result) {
              //client.end();
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
    } else {
      console.log('unauthorized');
      res.sendStatus(401);
    }
});

/*---- POST routes -----*/
router.post('/addClient', function(req, res) {
  console.log('in server making a new client', req.body);
  //date_tracked = date_tracked.format();

  if(req.user.role == ADMIN){
    pool.connect(function(err, client, done, next) {
      if(err) {
        console.log("Error connecting: ", err);
        //next(err);
      }
      //join goal, client, staff, job, job_site to find all goal date
      client.query("insert into client(staff_id, client_name) values($1, $2);",
      [req.body.staff_id, req.body.name],
          function (err, result) {
            done();
            if(err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(420);
            } else {
              res.sendStatus(202);
            }
      });
    });
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
});


module.exports = router;
