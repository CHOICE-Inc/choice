var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.get('/getStaff', function(req, res) {
  console.log('in server getting dem staff');

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //join client, staff, and users to filter all cleints from user login
    client.query("select * from staff join users on users.staff_id = staff.id",
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

router.get('/getAllStaff', function(req, res) {
  console.log('in server getting dem staff');

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //join client, staff, and users to filter all cleints from user login
    client.query("select * from staff",
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

router.put('/updateStaff/:id/:boolean', function(req, res){
  console.log('staff id', req.params.id);
  console.log('boolean', req.params.boolean);
  //console.log('blah ', req.params, req.params.boolean == 'false', req.params.boolean === false);
  var changeStatus;
  if(req.params.boolean === 'true'){
    changeStatus = false;
  } else if(req.params.boolean === 'false'){
    changeStatus = true;
  }

  console.log('changed to', changeStatus);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //update employment status of employee
    client.query("UPDATE staff SET employed = $1 WHERE id = $2;",
      [changeStatus, req.params.id],
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

module.exports = router;
