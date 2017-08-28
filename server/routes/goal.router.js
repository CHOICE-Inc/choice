var express = require('express');
var router = express.Router();

//DATA OBJECT NEEDED FROM CLIENT-SIDE
/* var goal = {
  client_id: client_id,
  jobsite_id: jobsite_id,
  implementation_date: implementation_date,
  review_dates: review_dates,
  completion_date: completion_date,
  service_outcome: service_outcome,
  objective: objective,
  implemented_by: implemented_by,
  behavior_technique: behavior_technique,
  modifications: modifications,
  equipment: equipment,
  when_notes: when_notes
}; */

/*
// POST ROUTE TO ADD NEW GOAL TO DB
route.post('/', function(req, res){
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
      var implemented_by = req.body.implemented_by;
      var behavior_technique = req.body.behavior_technique;
      var modifications = req.body.modifications;
      var equipment = req.body.equipment;
      var when_notes = req.body.when_notes;

      //BUILD DB QUERY STRING & DATA VALUE ARRAY
      var dbQueryString = 'INSERT INTO goal (client_id, jobsite_id, implementation_date, review_dates, completion_date, ' +
      'service_outcome, objective, implemented_by, behavior_technique, modifications, equipment, when_notes)' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
      console.log('For goal post, using DB query string: ', dbQueryString);

      var goalValuesArray = [client_id, jobsite_id, implementation_date, review_dates, completion_date,
      service_outcome, objective, implemented_by, behavior_technique, modifications, equipment, when_notes];
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


// GET ROUTE TO RETRIVE GOAL CRITERIA DATA FROM DB
// NEED GOAL ID TO ACCESS CORRECT GOAL
route.get('/:id', function(req, res){
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
          console.log('Goal criteria added to DB.');
          res.sendStatus(200);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route

// UPDATE ROUTE AFTER USER EDIT
// NEED GOAL ID TO ACCESS CORRECT GOAL
route.get('/:id', function(req, res){
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
      var implemented_by = req.body.implemented_by;
      var behavior_technique = req.body.behavior_technique;
      var modifications = req.body.modifications;
      var equipment = req.body.equipment;
      var when_notes = req.body.when_notes;

      //BUILD DB QUERY STRING & DATA VALUE ARRAY
      var dbQueryString = 'UPDATE goal SET client_id=$1, jobsite_id=$2, implementation_date=$3, ' +
      'review_dates=$4, completion_date=$5, service_outcome=$6, objective=$7, implemented_by=$8, ' +
      'behavior_technique=$9, modifications=$10, equipment=$11, when_notes=$12 WHERE id=$13';

      console.log('For goal update, using DB query string: ', dbQueryString);

      var goalValuesArray = [client_id, jobsite_id, implementation_date, review_dates, completion_date,
      service_outcome, objective, implemented_by, behavior_technique, modifications, equipment, when_notes, goal_ID];

      console.log('Going to update the DB with these values: ', goalValuesArray);
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





// UPDATE ROUTE TO DISABLE GOAL IN DB (INSTEAD OF DELETING THE GOAL, NEED RECORD-KEEPING)
// NEED GOAL ID TO ACCESS CORRECT GOAL
route.get('/:id', function(req, res){
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
          console.log('Goal criteria added to DB.');
          res.sendStatus(200);
        }
      }); //end of db.query

    } //end of DB connect if-else
  }); //end of pool.connect
}); // end of route


*/



module.exports = router;
