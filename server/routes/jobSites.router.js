var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

var ADMIN = 1;
var CASE = 2;

/*------- GET ROUTES ---------*/

//GET ROUTE FOR DISPLAYING ALL THE JOBSITES TO THE DOM
/**
* @api {get} /jobsites/managejobsites Retrieve ALL jobsite names and IDs
* @apiName GetAllJobsites
* @apiGroup RetrieveData
*
* @apiSuccess {String} address Jobsite's address
* @apiSuccess {String} business_name Jobsites's name
* @apiSuccess {String} contact Jobsite contact name
* @apiSuccess {Boolean} editing Boolean variable to determine edit status
* @apiSuccess {Number} id Jobsite ID
* @apiSuccess {Number} jobsite_id Jobsite's ID
* @apiSuccess {Boolean} jobsite_status Indicates active job site
* @apiSuccess {String} phone Phone number for job site
* @apiSuccess {String} status Label for edit button "Deactive" / "Activate"
*/
router.get('/managejobsites', function(req, res) {
  console.log('In server getting jobsites');

  if(req.user.role == ADMIN){
    pool.connect(function(err, db, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      //
      db.query("select * from job_site ORDER BY business_name;",
          function (err, result) {
            done();
            if(err) {
              console.log("Error inserting data: ", err);
            } else {
              console.log('RESULT ROWS', result.rows);
              res.send(result.rows);
            } //end of else statement
          }); //end of db query
    }); //end of pool.connect
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
}); //end of router.get


/*------- POST ROUTES ---------*/

//POST ROUTE TO ADD A NEW JOBSITE
/**
* @api {post} /jobsites/newjobsite Add a new jobsite to the database
* @apiName PostJobsite
* @apiGroup AddData
*
* @apiParam {String} address Jobsite's address
* @apiParam {String} business_name Jobsites's name
* @apiParam {String} contact Jobsite contact name
* @apiParam {Boolean} jobsite_status Indicates active job site
* @apiParam {String} phone Phone number for job site
* @apiParam {String} status Label for edit button "Deactive" / "Activate"
*/
router.post('/newjobsite', function(req, res) {
console.log('In post route to add new jobsite: ', req.body);

  if(req.user.role == ADMIN){
    pool.connect(function(errConnectingToDatabase, db, done){
      if(errConnectingToDatabase) {
        console.log('There was an error connecting to database: ', errConnectingToDatabase);
        res.sendStatus(500);
      } else {
        //DEFINE DATA VALUES
        //var jobSite_id = req.params.id;
        var business_name = req.body.business_name;
        var address = req.body.address;
        var phone = req.body.phone;
        var contact = req.body.contact;

        //BUILD DB QUERY STRING & DATA VALUE ARRAY
        var jobSitePostQueryString = 'INSERT INTO job_site (business_name, address, phone, ' +
        'contact) VALUES ($1, $2, $3, $4)';
        console.log('For jobsite post, using DB query string: ', jobSitePostQueryString);

        var jobSiteValuesArray = [business_name, address, phone, contact];
        console.log('Going to push these values to the DB: ', jobSiteValuesArray);

        // MAKE DB QUERY
        db.query(jobSitePostQueryString, jobSiteValuesArray, function(errMakingQuery, result){
          done();
          if(errMakingQuery){
            console.log('There was an error making POST query: ', errMakingQuery);
            res.sendStatus(500);
          } else {
            console.log('New Jobsite added to DB.');
            res.sendStatus(200);
          }
        }); //end of db.query
      } //end of DB connect if-else
    }); //end of pool.connect
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
}); //end of route

/*------- PUT ROUTES ---------*/

// UPDATE ROUTE AFTER USER EDIT
// NEED JOBSITE ID TO ACCESS CORRECT GOAL
router.put('/editjobsites', function(req, res){
  console.log('Going to put this updated data: ', req.body);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {

      //DEFINE DATA VALUES
      var jobSite_id = req.body.id;
      var business_name = req.body.business_name;
      var address = req.body.address;
      var phone = req.body.phone;
      var contact = req.body.contact;

      //BUILD DB QUERY STRING & DATA VALUE ARRAY

      var jobSiteQueryString = 'UPDATE job_site SET business_name=$1, address=$2, phone=$3, contact=$4 WHERE id=$5';

      console.log('For deactivating jobsite, using DB query string: ', jobSiteQueryString);

      var jobSiteArray = [business_name, address, phone, contact, jobSite_id];

      console.log('Going to update the DB with these values: ', jobSiteArray);
      // MAKE DB QUERY
      db.query(jobSiteQueryString, jobSiteArray, function(errMakingQuery, result){
        done();
        if(errMakingQuery){
          console.log('There was an error making INSERT query: ', errMakingQuery);
          res.sendStatus(500);
        } else {
          console.log('Goal criteria updated in DB.');
          res.sendStatus(200);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route

//DISABLE JOBSITE - UPDATE STATUS
/**
* @api {put} /jobsites/disablejobsite Disable a jobsite
* @apiName DisableJobsite
* @apiGroup UpdateData
*
* @apiParam {Number} id Jobsite's unique id
* @apiParam {Boolean} jobsite_status Indicates job site's active status
*/
router.put('/disablejobsite/:id/:boolean', function(req, res){
  console.log('In PUT route disable jobsite: ', req.params.id);

//  if/else statement to toggle jobsite_status to activate or deactivate
  var changeStatus;
  if(req.params.boolean === 'true'){
    changeStatus = false;
  } else if(req.params.boolean === 'false'){
    changeStatus = true;
  }
  console.log('changed jobsite_status to:', changeStatus);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // MAKE DB QUERY
      db.query('UPDATE job_site SET jobsite_status=$1 WHERE id=$2', [changeStatus, req.params.id], function(errMakingQuery, result){
        done();
        if(errMakingQuery){
          console.log('There was an error making INSERT query: ', errMakingQuery);
          res.sendStatus(500);
        } else {
          console.log('Goal status updated in DB.');
          res.sendStatus(200);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route

module.exports = router;
