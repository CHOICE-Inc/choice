var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

// Defining values for user roles
var ADMIN = 1;
var CASE = 2;

/*---- GET routes -----*/

//GET all Clients in the DB and display on the DOM
/**
* @api {get} /clients/getClients Retrieve ALL clients names and IDs
* @apiName GetAllClients
* @apiGroup RetrieveData
*
* @apiSuccess {Boolean} active Client's active status (is inactive if no longer w/ Choice)
* @apiSuccess {String} client_name Clients's name
* @apiSuccess {Number} clientid Client ID from client table
* @apiSuccess {Boolean} editing Indicates editing status for the input fields
* @apiSuccess {Number} staff_id Case Managers's ID from staff table
* @apiSuccess {String} staff_name Case Manager's name
* @apiSuccess {String} status Label for edit button "Deactive" / "Activate"
*/
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

//POST a new client to the DB and display on the DOM
/**
* @api {post} /clients/addClient Add a new client to the database
* @apiName PostClient
* @apiGroup AddData
*
* @apiParam {String} client_name Clients's name
* @apiSuccess {Number} staff_id Case Managers's ID from staff table
* @apiSuccess {String} staff_name Case Manager's name
*/
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

//------- PUT ROUTES -------

//updates client information
/**
* @api {put} /clients/updateClient Updates client's names in the database
* @apiName GetAllClients
* @apiGroup UpdateData
*
* @apiParam {Number} client Clients's unique ID
*/
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

module.exports = router;
