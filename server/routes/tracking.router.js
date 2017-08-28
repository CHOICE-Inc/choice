var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.get('/getClients', function(req, res) {
  console.log('in server getting dem clients');
  console.log('CURRENT USER ID', req.user.id);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
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

router.get('/getGoals/:id', function(req, res) {
  console.log('in server getting dem goals');
  console.log('all goals from this id ', req.params.id);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //join goal, client, staff, job, job_site to find all goal date
    client.query("select client.client_name, staff.staff_name as CaseManager, goal.implementation_date, goal.objective, goal.service_outcome as goalname, job_site.business_name from goal join client on goal.client_id = client.id join staff on staff.id = client.staff_id join job on job.goal_id = goal.id join job_site on job_site.id = job.jobsite_id where client.id = " + req.params.id,
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

router.post('/newGoalTrack', function(req, res) {
  console.log('in server making a new goal tracker');
  console.log('goal id is ', req.body.id);
  var goal_id = req.body.id;

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //join goal, client, staff, job, job_site to find all goal date
    client.query("insert into 'goal_tracking'(goal_id, date_tracked, am_or_pm, complete_or_not, notes, additional_notes) values(1, '', '', '', '', '');",
    [goal_id],
        function (err, result) {
          client.end();
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


module.exports = router;
