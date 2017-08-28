var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

/* -------------- POST ROUTES ---------------------- */

// ADD NEW GOAL TO DATABASE
router.post('/', function(req, res){
  console.log('In post route for goal criteria: ', req.body);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      //DEFINE DATA VALUES
      var client_id = req.body.client_id;
      var jobsite_id = req.body.jobsite_id;
      var implementation_date = req.body.implementation_date;
      var review_dates = req.body.review_dates;
      var completion_date = req.body.completion_date;
      var service_outcome = req.body.service_outcome;
      var objective = req.body.objective;
      var behavior_technique = req.body.behavior_technique;
      var modifications = req.body.modifications;
      var equipment = req.body.equipment;
      var when_notes = req.body.when_notes;

      //BUILD DB QUERY STRING & DATA VALUE ARRAY
      var dbQueryString = 'INSERT INTO goal (client_id, jobsite_id, implementation_date, review_dates, completion_date, ' +
      'service_outcome, objective, behavior_technique, modifications, equipment, when_notes, plan_steps)' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
      console.log('For goal post, using DB query string: ', dbQueryString);

      var goalValuesArray = [client_id, jobsite_id, implementation_date, review_dates, completion_date,
      service_outcome, objective, behavior_technique, modifications, equipment, when_notes, plan_steps];
      console.log('Going to push these values to the DB: ', goalValuesArray);

      // MAKE DB QUERY
      db.query(dbQueryString, goalValuesArray, function(errMakingQuery, result){
        done();
        if(errMakingQuery){
          console.log('There was an error making INSERT query: ', errMakingQuery);
          res.sendStatus(500);
        } else {
          console.log('Goal criteria added to DB.');
          res.sendStatus(200);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route

/* -------------- GET ROUTES ---------------------- */

// RETIEVE CLIENT NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
router.get('/clients', function(req, res){
  console.log('In get route for client names.');

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      //BUILD DB QUERY STRING

      // MAKE DB QUERY
      db.query('SELECT id, name FROM client', function(errMakingQuery, result){
        done();
        if(errMakingQuery){
          console.log('There was an error making INSERT query: ', errMakingQuery);
          res.sendStatus(500);
        } else {
          console.log('Retrieved client data from DB: ', result);
          res.send(result.rows);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route


// RETIEVE JOB SITES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
router.get('/jobsites', function(req, res){
  console.log('In get route for job sites: ');

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      //BUILD DB QUERY STRING

      // MAKE DB QUERY
      db.query('SELECT id, business_name FROM job_site', function(errMakingQuery, result){
        done();
        if(errMakingQuery){
          console.log('There was an error making INSERT query: ', errMakingQuery);
          res.sendStatus(500);
        } else {
          console.log('Retrieved job site data from DB: ', result);
          res.send(result.rows);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route


// GET ROUTE TO RETRIVE GOAL CRITERIA DATA FROM DB
// NEED GOAL ID TO ACCESS CORRECT GOAL
router.get('/:id', function(req, res){
  console.log('In get route for client\'s goal criteria: ', req.params.id);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      //BUILD DB QUERY STRING

      // MAKE DB QUERY
      db.query('SELECT * FROM goal WHERE id=$1', [req.params.id], function(errMakingQuery, result){
        done();
        if(errMakingQuery){
          console.log('There was an error making INSERT query: ', errMakingQuery);
          res.sendStatus(500);
        } else {
          console.log('Retrieved criteria data from DB: ', result);
          res.send(result.rows);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route


/* -------------- PUT ROUTES ---------------------- */

// UPDATE ROUTE AFTER USER EDIT
// NEED GOAL ID TO ACCESS CORRECT GOAL
router.put('/:id', function(req, res){
  console.log('In put route for client\'s goal to disable goal: ', req.params.id);
  console.log('Going to put this updated data: ', req.body);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {

      //DEFINE DATA VALUES
      var goal_ID = req.params.id;

      var client_id = req.body.client_id;
      var jobsite_id = req.body.jobsite_id;
      var implementation_date = req.body.implementation_date;
      var review_dates = req.body.review_dates;
      var completion_date = req.body.completion_date;
      var service_outcome = req.body.service_outcome;
      var objective = req.body.objective;
      var behavior_technique = req.body.behavior_technique;
      var modifications = req.body.modifications;
      var equipment = req.body.equipment;
      var when_notes = req.body.when_notes;
      var plan_steps = req.body.plan_steps;

      //BUILD DB QUERY STRING & DATA VALUE ARRAY
      var dbQueryString = 'UPDATE goal SET client_id=$1, jobsite_id=$2, implementation_date=$3, ' +
      'review_dates=$4, completion_date=$5, service_outcome=$6, objective=$7, ' +
      'behavior_technique=$8, modifications=$9, equipment=$10, when_notes=$11, plan_steps=$12 WHERE id=$13';

      console.log('For goal update, using DB query string: ', dbQueryString);

      var goalValuesArray = [client_id, jobsite_id, implementation_date, review_dates, completion_date,
      service_outcome, objective, behavior_technique, modifications, equipment, when_notes, plan_steps, goal_ID];

      console.log('Going to update the DB with these values: ', goalValuesArray);
      // MAKE DB QUERY
      db.query(dbQueryString, goalValuesArray, function(errMakingQuery, result){
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


// UPDATE ROUTE TO DISABLE GOAL IN DB (INSTEAD OF DELETING THE GOAL, NEED RECORD-KEEPING)
// NEED GOAL ID TO ACCESS CORRECT GOAL
router.put('/:id', function(req, res){
  console.log('In put route for client\'s goal to disable goal: ', req.params.id);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      //BUILD DB QUERY STRING

      // MAKE DB QUERY
      db.query('UPDATE goal SET goal_status=FALSE WHERE id=$1', [req.params.id], function(errMakingQuery, result){
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
