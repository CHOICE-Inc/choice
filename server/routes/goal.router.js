var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

var ADMIN = 1;
var CASE = 2;


/* -------------- GET ROUTES ---------------------- */

// GET REQUEST TO RETIEVE CLIENT NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
  /**
  /* @api {get} /goal/clients Retrieve client names and IDs
  * @apiName GetClientsNames
  * @apiGroup Clients
  *
  * @apiSuccess {Number} client.id  Client's ID from client table
  * @apiSuccess {String} client_name Name of Client
  * @apiSuccess {String} staff_name Name of Case Manager
  * @apiSuccess {Number} staff_id Case Manager ID from staff table
  */
router.get('/clients', function(req, res){
  console.log('In get route for client names.');

  if(req.user.role == ADMIN || req.user.role == CASE){
    pool.connect(function(errConnectingToDatabase, db, done){
      if(errConnectingToDatabase) {
        console.log('There was an error connecting to database: ', errConnectingToDatabase);
        res.sendStatus(500);
      } else {
        // MAKE DB QUERY
        db.query('SELECT client.id as id, client_name, staff_name, staff.id as staff_id FROM client JOIN staff on client.staff_id = staff.id WHERE client.active = true;',
        function(errMakingQuery, result){
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
}); // end of route

// RETIEVE CASE MANAGER NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
/**
* @api {get} /goal/casemanager Retrieve case manager names and IDs
* @apiName GetCaseManagerNames
* @apiGroup Staff
*
* @apiSuccess {Number} id  CaseManager's ID from staff table
* @apiSuccess {String} staff_name Name of Case Manager
* @apiSuccess {String} email Case manager's email
* @apiSuccess {Number} role Number designation for staff role
* @apiSuccess {Boolean} employed Shows true if still an employee
*/
router.get('/casemanager', function(req, res){
  console.log('In get route for client names. ');
  var getCaseManagersQuery = 'SELECT * FROM "staff" WHERE "role" = 2 and employed = true;';
     console.log("Getting all Case Managers: ", getCaseManagersQuery);
  if(req.user.role == ADMIN || req.user.role == CASE){
    pool.connect(function(errConnectingToDatabase, db, done){
      if(errConnectingToDatabase) {
        console.log('There was an error connecting to database: ', errConnectingToDatabase);
        res.sendStatus(500);
      } else {
        // MAKE DB QUERY
        db.query(getCaseManagersQuery, function(errMakingQuery, result){
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
}); // end of route


// RETIEVE JOB SITES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
/**
* @api {get} /goal/jobsites Retrieve jobsite names and IDs
* @apiName GetJobsiteNames
* @apiGroup Jobsites
*
* @apiSuccess {String} business_name Name of Jobsite Business
* @apiSuccess {Number} id  Jobsite's ID from job_site table
*/
router.get('/jobsites', function(req, res){
  console.log('In get route for job sites: ');
  if(req.user.role == ADMIN || req.user.role == CASE){
    pool.connect(function(errConnectingToDatabase, db, done){
      if(errConnectingToDatabase) {
        console.log('There was an error connecting to database: ', errConnectingToDatabase);
        res.sendStatus(500);
      } else {
        // MAKE DB QUERY
        db.query('SELECT id, business_name FROM job_site where jobsite_status = true;', function(errMakingQuery, result){
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
}); // end of route

// GET ROUTE TO RETRIVE * ALL THE GOAL CRITERIA * IN THE DB FOR THE SPECIFIED USER
/**
* @api {get} /goal/allCriteria Retrieve all the goals for a given client
* @apiName GetAllGoals
* @apiGroup Goals
*
* @apiParam {Number} client_id Client's unique id
*
* @apiSuccess {Boolean} active  If goal has NOT been disabled, return true
* @apiSuccess {String} address Jobsite's address
* @apiSuccess {String} behavior_techniques Goals's behavior techniques
* @apiSuccess {String} business_name Jobsites's name
* @apiSuccess {Number} client_id  Client's ID from clients table
* @apiSuccess {String} client_name Client's name from clients table
* @apiSuccess {String} completion_date Date string for completion date
* @apiSuccess {String} contact Jobsite contact info
* @apiSuccess {String} equipment Equipment needed for goal
* @apiSuccess {String} goal_name Name of the goal
* @apiSuccess {Boolean} goal_status Active goal or not
* @apiSuccess {String} goal_summary Summary of the goal
* @apiSuccess {Number} goalid  Goal's ID from goals table
* @apiSuccess {Number} id Jobsite ID
* @apiSuccess {STring} implementation_date Date of goal's implementation
* @apiSuccess {String} jobsite_details Details about the job site used or sites
* @apiSuccess {Number} jobsite_id Jobsite's ID
* @apiSuccess {Boolean} jobsite_status Indicates active job site
* @apiSuccess {String} modifications Modifications needed for the goal
* @apiSuccess {String} objective Goal's overall objective
* @apiSuccess {String} phone Phone number for job site
* @apiSuccess {String} plan_steps Steps required to carry out the goal
* @apiSuccess {String} review_dates Future dates (MM/YYYY) for review of goal
* @apiSuccess {String} service_outcome Goal's service outcome
* @apiSuccess {Number} staff_id Case manager id from staff table
* @apiSuccess {String} when_notes Details about when the goal will be evaluated
*/
router.get('/allCriteria/:id', function(req, res){
  console.log('In get route for client\'s goal criteria: ', req.params.id);
  if(req.user.role == ADMIN || req.user.role == CASE){
    pool.connect(function(errConnectingToDatabase, db, done){
      if(errConnectingToDatabase) {
        console.log('There was an error connecting to database: ', errConnectingToDatabase);
        res.sendStatus(500);
      } else {
        // BUILD DB QUERY STRING

        var dbQueryString = 'SELECT goal.id as goalid, * FROM "goal" ' +

        'JOIN "client" ON "goal"."client_id" = "client"."id" ' +
        'JOIN "job_site" ON "job_site"."id" = "goal"."jobsite_id"' +
        'WHERE "client_id" = $1 ';

        // MAKE DB QUERY
        db.query(dbQueryString, [req.params.id], function(errMakingQuery, result){
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
}); // end of route


// GET ROUTE TO RETRIVE GOAL CRITERIA DATA FROM DB
// NEED GOAL ID TO ACCESS ONE (CORRECT/THIS) GOAL
/**
* @api {get} /goal/singlecriteria Retrieve a single goal for a given client
* @apiName GetSingleGoal
* @apiGroup Goals
*
* @apiParam {Number} goal Goal's unique id
* @apiParam {Number} client_id Client's unique id
*
* @apiSuccess {Boolean} active  If goal has NOT been disabled, return true
* @apiSuccess {String} address Jobsite's address
* @apiSuccess {String} behavior_techniques Goals's behavior techniques
* @apiSuccess {String} business_name Jobsites's name
* @apiSuccess {Number} client_id  Client's ID from clients table
* @apiSuccess {String} client_name Client's name from clients table
* @apiSuccess {String} completion_date Date string for completion date
* @apiSuccess {String} contact Jobsite contact info
* @apiSuccess {String} email Case manager's email
* @apiSuccess {Boolean} employed True if case manager is still staff
* @apiSuccess {String} equipment Equipment needed for goal
* @apiSuccess {String} goal_name Name of the goal
* @apiSuccess {Boolean} goal_status Active goal or not
* @apiSuccess {String} goal_summary Summary of the goal
* @apiSuccess {Number} goalid  Goal's ID from goals table
* @apiSuccess {Number} id Jobsite ID
* @apiSuccess {String} implementation_date Date of goal's implementation
* @apiSuccess {String} jobsite_details Details about the job site used or sites
* @apiSuccess {Number} jobsite_id Jobsite's ID
* @apiSuccess {Boolean} jobsite_status Indicates active job site
* @apiSuccess {String} modifications Modifications needed for the goal
* @apiSuccess {String} objective Goal's overall objective
* @apiSuccess {String} phone Phone number for job site
* @apiSuccess {String} plan_steps Steps required to carry out the goal
* @apiSuccess {String} review_dates Future dates (MM/YYYY) for review of goal
* @apiSuccess {Number} role Staff's role (1-admin, 2-case manager, 3-staff)
* @apiSuccess {String} service_outcome Goal's service outcome
* @apiSuccess {Number} staff_id Case manager id from staff table
* @apiSuccess {String} staff_name Case manager's name from staff table
* @apiSuccess {String} when_notes Details about when the goal will be evaluated
*/
router.get('/singlecriteria', function(req, res){
  console.log('In get route for client\'s goal criteria: ', req.query);
  console.log('on server, client_id = ', req.query.client_id, 'on server, goal_id = ', req.query.goal_id);

  var getGoal = 'SELECT goal.id as goalID, * FROM "client" JOIN "staff" ON "client"."staff_id" = "staff"."id" JOIN "goal" ON "goal"."client_id" = "client"."id" JOIN "job_site" ON "job_site"."id" = "goal"."jobsite_id" WHERE "client_id" = $1 AND "goal"."id" = $2';

  var clientID = parseInt(req.query.client_id);
  var goalID = parseInt(req.query.goal_id);
  console.log('on server after parseInt, client_id = ', clientID, 'on server, goal_id = ', goalID);


    pool.connect(function(errConnectingToDatabase, db, done){
      if(errConnectingToDatabase) {
        console.log('There was an error connecting to database: ', errConnectingToDatabase);
        res.sendStatus(500);
      } else {
        // MAKE DB QUERY
        db.query(getGoal, [clientID, goalID], function(errMakingQuery, result){
          done();
          if(errMakingQuery){
            console.log('There was an error making INSERT query: ', errMakingQuery);
            res.sendStatus(500);
          } else {
            console.log('Retrieved criteria data from DB: ', result.rows);
            res.send(result.rows);
          }
        }); //end of db.query

      } //end of DB connect if-else
    }); //end of pool.connect

}); // end of router

/* -------------- POST ROUTES ---------------------- */

// ADD NEW GOAL TO DATABASE
/**
* @api {post} /goal Add a single goal to the database
* @apiName AddGoal
* @apiGroup Goals
*
* @apiParam {String} behavior_techniques Goals's behavior techniques
* @apiParam {Number} client_id  Client's ID (assigned to goal object in another function)
* @apiParam {String} completion_date Date string for completion date
* @apiParam {String} equipment Equipment needed for goal
* @apiParam {String} goal_name Name of the goal
* @apiParam {String} goal_summary Summary of the goal
* @apiParam {String} implementation_date Date of goal's implementation
* @apiParam {Number} id Jobsite ID (assigned to goal object in another function)
* @apiParam {String} jobsite_details Details about the job site used or sites
* @apiParam {String} modifications Modifications needed for the goal
* @apiParam {String} objective Goal's overall objective
* @apiParam {String} plan_steps Steps required to carry out the goal
* @apiParam {String} review_dates Future dates (MM/YYYY) for review of goal
* @apiParam {String} service_outcome Goal's service outcome
* @apiParam {String} when_notes Details about when the goal will be evaluated
*/
router.post('/', function(req, res){
  console.log('In post route for goal criteria: ', req.body);

  if(req.user.role == ADMIN || req.user.role == CASE){
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
        var behavior_techniques = req.body.behavior_techniques;
        var modifications = req.body.modifications;
        var equipment = req.body.equipment;
        var jobsite_details = req.body.jobsite_details;
        var when_notes = req.body.when_notes;
        var plan_steps = req.body.plan_steps;
        var goal_name = req.body.goal_name;
        var goal_summary = req.body.goal_summary;

        //BUILD DB QUERY STRING & DATA VALUE ARRAY
        var dbQueryString = 'INSERT INTO goal (client_id, jobsite_id, implementation_date, review_dates, completion_date, ' +
        'service_outcome, objective, behavior_techniques, modifications, equipment, jobsite_details, when_notes, plan_steps, ' +
        'goal_name, goal_summary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        console.log('For goal post, using DB query string: ', dbQueryString);

        var goalValuesArray = [client_id, jobsite_id, implementation_date, review_dates, completion_date, service_outcome,
              objective, behavior_techniques, modifications, equipment, jobsite_details, when_notes, plan_steps, goal_name, goal_summary];
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
  } else {
    console.log('unauthorized');
    res.sendStatus(401);
  }
}); // end of route


/* -------------- PUT ROUTES ---------------------- */

// UPDATE ROUTE AFTER USER EDIT
// NEED GOAL ID TO ACCESS CORRECT GOAL
/**
* @api {put} /goal Update a goal in the database
* @apiName UpdateGoal
* @apiGroup Goals
*
* @apiParam {String} behavior_techniques Goals's behavior techniques
* @apiParam {Number} client_id  Client's ID (assigned to goal object in another function)
* @apiParam {String} completion_date Date string for completion date
* @apiParam {String} equipment Equipment needed for goal
* @apiParam {String} goal_name Name of the goal
* @apiParam {String} goal_summary Summary of the goal
* @apiParam {String} implementation_date Date of goal's implementation
* @apiParam {Number} id Jobsite ID (assigned to goal object in another function)
* @apiParam {String} jobsite_details Details about the job site used or sites
* @apiParam {String} modifications Modifications needed for the goal
* @apiParam {String} objective Goal's overall objective
* @apiParam {String} plan_steps Steps required to carry out the goal
* @apiParam {String} review_dates Future dates (MM/YYYY) for review of goal
* @apiParam {String} service_outcome Goal's service outcome
* @apiParam {String} when_notes Details about when the goal will be evaluated
*/
router.put('/:id', function(req, res){
  console.log('In put route for client\'s goal to update goal: ', req.params.id);
  console.log('Going to put this updated data: ', req.body);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {

      //DEFINE DATA VALUES
      var goal_id = req.params.id;

      var client_id = req.body.client_id;
      var jobsite_id = req.body.jobsite_id;
      var implementation_date = req.body.implementation_date;
      var review_dates = req.body.review_dates;
      var completion_date = req.body.completion_date;
      var service_outcome = req.body.service_outcome;
      var objective = req.body.objective;
      var jobsite_details = req.body.jobsite_details;
      var behavior_techniques = req.body.behavior_techniques;
      var modifications = req.body.modifications;
      var equipment = req.body.equipment;
      var when_notes = req.body.when_notes;
      var plan_steps = req.body.plan_steps;
      var goal_name = req.body.goal_name;
      var goal_summary = req.body.goal_summary;

      //BUILD DB QUERY STRING & DATA VALUE ARRAY
      var dbQueryString = 'UPDATE goal SET client_id=$1, jobsite_id=$2, implementation_date=$3, ' +
      'review_dates=$4, completion_date=$5, service_outcome=$6, objective=$7, jobsite_details=$8, ' +
      'behavior_techniques=$9, modifications=$10, equipment=$11, when_notes=$12, plan_steps=$13, goal_name=$14, goal_summary=$15 WHERE id=$16';

      console.log('For goal update, using DB query string: ', dbQueryString);

      var goalValuesArray = [client_id, jobsite_id, implementation_date, review_dates, completion_date,
      service_outcome, objective, jobsite_details, behavior_techniques, modifications, equipment, when_notes, plan_steps, goal_name, goal_summary, goal_id];

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
/**
/* @api {put} /goal/disable/goal_id/goal_status Change goal's active status
* @apiName DisableGoal
* @apiGroup Goals
*
* @apiParam {Number} goal.id  Goal's ID from goal table
* @apiParam {Boolean} boolean Current status of goal (true or false)
* @apiParam {Number} client_id Client's ID from client table
*/
router.put('/disable/:id/:boolean', function(req, res){
  console.log('In put route for client\'s goal to disable goal: ', req.params.id);

  var changeStatus;
  if(req.params.boolean === 'true'){
    changeStatus = false;
  } else if(req.params.boolean === 'false'){
    changeStatus = true;
  }
  console.log('changed goal status to:', changeStatus);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      //BUILD DB QUERY STRING

      // MAKE DB QUERY
      db.query('UPDATE goal SET goal_status= $1 WHERE id= $2', [changeStatus, req.params.id], function(errMakingQuery, result){
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
