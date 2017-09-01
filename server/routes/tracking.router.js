var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.get('/getClients', function(req, res) {
  console.log('in server getting dem clients');
  console.log('CURRENT USER ID', req.user.id);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //join client, staff, and users to filter all cleints from user login
    client.query("select client.id as clientid, client.client_name, staff.id as staffid, staff.staff_name, " +
    "job_site.id as jobsite_id, job_site.business_name from client join goal on goal.client_id = client.id " +
    "join job_site on goal.jobsite_id = job_site.id join staff on client.staff_id = staff.id " +
    "join users on users.staff_id = users.staff_id where users.id = " + req.user.id + ";",
        function (err, result) {
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

router.get('/getGoals/:id', function(req, res) { //and latest goal_tracking submission
  console.log('in server getting dem goals');
  console.log('all goals from this id ', req.params.id); //client id

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //make two CTE'S that will find last submitted for specific am or pm submission tied to each goal
    client.query("WITH get_date_tracked_am AS (SELECT goal_id, am_or_pm as am, max(date_tracked) as dt " +
    "FROM goal_tracking where am_or_pm ilike 'am' GROUP BY goal_id, am_or_pm), get_date_tracked_pm " +
    "AS (select goal_id, am_or_pm as pm, max(date_tracked) as dt from goal_tracking " +
    "where am_or_pm ilike 'pm' group by goal_id, am_or_pm)select goal.id as goalid, client.client_name, " +
    "staff.staff_name, goal.implementation_date, goal.goal_summary as goalNotes, goal.goal_name as goalName, " +
    "job_site.business_name, get_date_tracked_am.am, get_date_tracked_am.dt as max_goal_date_am, " +
    "get_date_tracked_pm.pm, get_date_tracked_pm.dt as max_goal_date_pm from goal join client on " +
    "goal.client_id = client.id join staff on staff.id = client.staff_id join job_site on job_site.id = goal.jobsite_id " +
    "left join get_date_tracked_am on goal.id = get_date_tracked_am.goal_id left join get_date_tracked_pm on " +
    "goal.id = get_date_tracked_pm.goal_id WHERE client_id = " + req.params.id + ";",
        function (err, result) {
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



router.post('/trackGoal', function(req, res) {
  console.log('in server making a new goal tracker', req.body);
  console.log('goal id is ', req.body.id);

  var goal_id = req.body.id;
  var date_tracked = req.body.date;

  //date_tracked = date_tracked.format();


  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //join goal, client, staff, job, job_site to find all goal date
    client.query("insert into goal_tracking(goal_id, am_or_pm, complete_or_not, notes, date_tracked) values($1, $2, $3, $4, $5);",
    [req.body.id, req.body.time, req.body.completion, req.body.notes, req.body.date],
        function (err, result) {
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


//Chase Router
router.get('/getGoalHistory/:id', function(req, res) {
  console.log('in server getting goal history');
  console.log('with goal id', req.params.id);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //get goal history by goal id
    client.query("select * from goal_tracking where goal_id = 1 order by date_tracked;",
        function (err, result) {
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
//End Chase Router

module.exports = router;
