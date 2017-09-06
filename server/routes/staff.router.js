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
    client.query("select staff.id as staffs_id, users.id as users_id, * from staff left join users on users.staff_id = staff.id",
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

router.put('/toggleStaff/:id/:boolean', function(req, res){
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

router.post('/newStaff', function(req, res){

  console.log('employee', req.body);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //make a new employee
    client.query("insert into staff(staff_name, location, email, role) values($1, $2, $3, $4);",
      [req.body.name, req.body.location.place, req.body.email, req.body.role.type],
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

router.put('/updateStaff', function(req, res){
  console.log('employee to update', req.body);
  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //make a new employee
    client.query("update staff set staff_name = $1, location = $2, email = $3, role = $4 where id = $5;",
      [req.body.staff_name, req.body.location, req.body.email, req.body.role, req.body.staffs_id],
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

module.exports = router;
