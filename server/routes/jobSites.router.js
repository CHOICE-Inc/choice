var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

//GET ROUTE FOR DISPLAYING ALL THE JOBSITES TO THE DOM
router.get('/managejobsites', function(req, res) {
  console.log('In server getting jobsites');

  pool.connect(function(err, db, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //
    db.query("select * from job_site",
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
}); //end of router.get

//POST ROUTE TO ADD A NEW JOBSITE
router.post('/'), (function(req, res) {
console.log('In post route to add new jobsite: ', req.body);

pool.connect(function(errConnectingToDatabase, db, done){
  if(errConnectingToDatabase) {
    console.log('There was an error connecting to database: ', errConnectingToDatabase);
    res.sendStatus(500);
  } else {
    //DEFINE DATA VALUES
    //var jobSite_id = req.params.id;
    var business_name = req.params.business_name;
    var address = req.params.address;
    var phone = req.params.phone;
    var contact = req.params.contact;
    var jobsiteStatus = req.params.jobsite_status;

    //BUILD DB QUERY STRING & DATA VALUE ARRAY
    var jobSitePostQueryString = 'INSERT INTO job_site (business_name, address, phone, ' +
    'contact, jobsites_status) VALUES ($1, $2, $3, $4, $5)';
    console.log('For jobsite post, using DB query string: ', jobSitePostQueryString);

    var jobSiteValuesArray = [business_name, address, phone, contact, jobsiteStatus];
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
}); //end of route


// UPDATE ROUTE AFTER USER EDIT
// NEED JOBSITE ID TO ACCESS CORRECT GOAL
router.put('/editjobsites', function(req, res){
  console.log('In put route to update jobsites: ', req.params.id);
  console.log('Going to put this updated data: ', req.body);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {

      //DEFINE DATA VALUES
      var jobSite_id = req.params.id;
      var business_name = req.params.business_name;
      var address = req.params.address;
      var phone = req.params.phone;
      var contact = req.params.contact;
      var jobsiteStatus = req.params.jobsite_status;

      //BUILD DB QUERY STRING & DATA VALUE ARRAY

      var jobSiteQueryString = 'UPDATE job_site SET business_name=$1, address=$2, phone=$3, contact=$4, jobsiteStatus=$5 WHERE jobSite_id=$6';

      console.log('For deactivating jobsite, using DB query string: ', jobSiteQueryString);

      var jobSiteArray = [business_name, address, phone, contact, jobsiteStatus, jobSite_id];

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

//PUT ROUTE TO UPDATE JOBSITES
router.put('/disablejobsite/:id', function(req, res){
  console.log('In put route disable jobsite: ', req.params.id);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // MAKE DB QUERY
      db.query('UPDATE job_site SET jobsite_status=FALSE WHERE id=$1', [req.params.id], function(errMakingQuery, result){
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
