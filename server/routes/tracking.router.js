var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

  // function getLocation(req, res){
  //   pool.connect(function(err, client, done, next) {
  //     if(err) {
  //       console.log("Error connecting: ", err);
  //     }
  //     var location;
  //     client.query("select location from staff join users on staff.id = users.staff_id where users.id = "+ req.user.id+";",
  //         function (err, result) {
  //           client.end();
  //           done();
  //           if(err) {
  //             console.log("Error inserting data: ", err);
  //             next(err);
  //           } else {
  //             console.log('location', result.rows[0].location);
  //             location = result.rows[0].location;
  //
  //           }
  //         });
  //   });
  //   return location;
  // }

router.get('/getClients', function(req, res) {
  console.log('in server getting dem clients');
  console.log('CURRENT USER ID', req.user.id);

  //start getLocation
  //  console.log(getLocation(req, res));
  //  var location = getLocation(req, res);
  //  console.log('LOCATION', location);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //join client, staff, and users to filter all cleints from user login
    client.query("select client.id, client.name, client.staff_id, staff.name, staff.location, job_site.id, job_site.business_name from client join staff on staff.id = client.staff_id join users on users.staff_id = staff.id join goal on goal.implemented_by = staff.id join job on goal.jobsite_id = job.goal_id join job_site on job_site.id = job.jobsite_id where users.id = " + req.user.id + ";",
        function (err, result) {
          client.end();
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

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //join goal, client, staff, job, job_site to find all goal date
    client.query("select client.name, staff.name as CaseManager, goal.implementation_date, goal.objective, goal.service_outcome as goalname, job_site.business_name from goal join client on goal.client_id = client.id join staff on staff.id = client.staff_id join job on job.goal_id = goal.id join job_site on job_site.id = job.jobsite_id where client.id = " + req.params.id + ";",
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

router.post('/newGoalTrack', function(req, res) {
  console.log('in server making a new goal tracker');
  console.log('goal id is ', req.body.id);
  var goal_id = req.body.id;

  pool.connect(function(err, client, done) {
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
