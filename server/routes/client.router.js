var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.get('/getClients', function(req, res) {
  console.log('in server getting clients');

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }

    client.query("select client.id as clientid, staff_id, client_name, staff_name, active from client join staff on (client.staff_id = staff.id) order by active DESC;",
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
});

router.put('/updateClient/', function(req, res){
  console.log('in updateClient with:', req.body);
  //console.log('blah ', req.params, req.params.boolean == 'false', req.params.boolean === false);


  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //update employment status of employee
    client.query("UPDATE client SET active = $1,staff_id = $2,client_name = $3 WHERE id = $4;",
      [req.body.active, req.body.staff_id, req.body.client_name, req.body.clientid],
        function (err, result) {
          //client.end();
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            res.sendStatus(420);
            //next(err);
          } else {
            //console.log('RESULT ROWS', result.rows);
            res.sendStatus(202);
          }
        });
  });
});

router.post('/addClient', function(req, res) {
  console.log('in server making a new client', req.body);
  //date_tracked = date_tracked.format();


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
            //next(err);
          } else {
            res.sendStatus(202);
          }
    });
  });
});

module.exports = router;
