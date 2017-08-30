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
    client.query("select client.id as clientid, client.client_name, staff.id as staffid, staff.staff_name, job_site.id as jobsite_id, job_site.business_name from goal join client on goal.client_id = client.id join job on goal.id = job.goal_id join job_site on job.jobsite_id = job_site.id join staff on staff.id = client.staff_id join users on users.staff_id = staff.id where users.id = " + req.user.id + ";",
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
  console.log('all goals from this id ', req.params.id);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //join goal, client, staff, job, job_site to find all goal date
    client.query("select goal.id, client.client_name, staff.staff_name, goal.implementation_date, goal.objective, goal.service_outcome as goalname, job_site.business_name, goal_tracking.am_or_pm, goal_tracking.date_tracked from goal join client on goal.client_id = client.id join staff on staff.id = client.staff_id join job on job.goal_id = goal.id join job_site on job_site.id = job.jobsite_id left join goal_tracking on goal.id = goal_tracking.goal_id where client.id = " + req.params.id + " order by date_tracked desc;",
        function (err, result) {
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
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


module.exports = router;
