var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

var ADMIN = 1;
var CASE = 2;

// ----------GET ROUTES------------

//GET all Staff Members in the DB and display on the DOM
/**
* @api {get} /staff/getStaff Retrieve ALL staff names, roles and IDs
* @apiName GetAllStaff
* @apiGroup RetrieveData
*
* @apiSuccess {String} email Case manager's email
* @apiSuccess {Boolean} employed True if case manager is still staff
* @apiSuccess {Number} id ID from staff table
* @apiSuccess {String} password !!!!!!!!!!!!!!!!!!!!!!
* @apiSuccess {Number} role Staff's role (1-admin, 2-case manager, 3-staff)
* @apiSuccess {String} roleString Staff's role name (1-admin, 2-case manager, 3-staff)
* @apiSuccess {Number} staff_id Case manager id from staff table
* @apiSuccess {String} staff_name Case manager's name from staff table
* @apiSuccess {String} status Indicates if staff is active or inactive
* @apiSuccess {String} user_role Indicates staff's role, listed in user table
* @apiSuccess {String} username Staff's user name for login
* @apiSuccess {String} users_id Staff's ID from the users table
*/
router.get('/getStaff', function(req, res) {
  console.log('in server getting dem staff');
  console.log('USER ROLE', req.user.role);
  if(req.user.role == ADMIN){
    pool.connect(function(err, client, done, next) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      //join client, staff, and users to filter all cleints from user login
      client.query("select staff.id as staffs_id, users.id as users_id, * from staff left join users on users.staff_id = staff.id order by employed DESC, role, staff_name;",
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
    //not authorized
    res.sendStatus(401);
  }
});


router.get('/getAllStaff', function(req, res) {
  console.log('in server getting dem staff');
  if(req.user.role == ADMIN){
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
});

// gets list of staff
/**
* @api {get} /staff/getAllCM Retrieve ALL case manager names and IDs
* @apiName GetAllCaseManagers
* @apiGroup RetrieveData
*
* @apiSuccess {String} email Case Managers's email
* @apiSuccess {Boolean} employed Indicates employment status (true = employed)
* @apiSuccess {Number} id ID of listing from staff table
* @apiSuccess {Number} staff_id Case Managers's ID from staff table
* @apiSuccess {String} staff_name Case Manager's name
*/
router.get('/getAllCM', function(req, res) {
  console.log('in server getting dem staff');
  if(req.user.role == ADMIN){
    pool.connect(function(err, client, done, next) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      //join client, staff, and users to filter all clients from user login
      client.query("select * from staff where role = 2;",
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


// ----------POST ROUTES------------

//POST a new Staff Member to the DB and display on the DOM
/**
* @api {post} /staff/newStaff Retrieve ALL staff names, roles and IDs
* @apiName PostStaff
* @apiGroup AddData
*
* @apiParam {String} email Case manager's email
* @apiParam {Number} role Staff's role (1-admin, 2-case manager, 3-staff)
* @apiParam {String} name Case manager's name from staff table
*/
router.post('/newStaff', function(req, res){
  console.log('employee', req.body);
  if(req.user.role == ADMIN){
    pool.connect(function(err, client, done, next) {
      if(err) {
        console.log("Error connecting: ", err);
        //next(err);
      }
      //make a new employee
      client.query("insert into staff(staff_name, email, role) values($1, $2, $3);",
        [req.body.name, req.body.email, req.body.role],
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
});

// ----------PUT ROUTES------------

//UPDATE a Staff Member in the DB
/**
* @api {put} /staff/updateStaff Update staff name, role
* @apiName UpdateStaff
* @apiGroup UpdateData
*
* @apiParam {String} email Case manager's email
* @apiParam {Number} role Staff's role (1-admin, 2-case manager, 3-staff)
* @apiParam {String} name Case manager's name from staff table
*/
router.put('/updateStaff', function(req, res){
  console.log('employee to update', req.body);
  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //make a new employee
    client.query("update staff set staff_name = $1, email = $2, role = $3, employed = $4 where id = $5;",
      [req.body.staff_name, req.body.email, req.body.role, req.body.employed, req.body.staffs_id],
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

//UPDATE Staff Member's Employment Status in the DB
/**
* @api {put} /toggleStaff/staffID/staff_status Toggle staff's employment status
* @apiName UpdateStaffStatus
* @apiGroup UpdateData
*
* @apiParam {Number} staff_id Staff's ID
* @apiParam {Boolean} staff_status Employment status (true = employed)
*/
router.put('/toggleStaff/:id/:boolean', function(req, res){
  console.log('staff id', req.params.id);
  console.log('boolean', req.params.boolean);
  //console.log('blah ', req.params, req.params.boolean == 'false', req.params.boolean === false);

  if(req.user.role == ADMIN){
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
});


module.exports = router;
