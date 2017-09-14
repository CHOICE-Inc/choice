var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

//---- NODEMAILER ------
var nodemailer = require('nodemailer');

var emailUser = process.env.EMAIL_USER || require('../config.js').user;
var emailPass = process.env.EMAIL_PASS || require('../config.js').pass;
var transporter = nodemailer.createTransport({
    // host: 'smtp.example.com',
    service: 'Gmail',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

// setup email data with unicode symbols
var mailOptions = {
    from: '"CHOICE" <choice.noreply@gmail.com>', // sender address
    to: 'choice.noreply@gmail.com', // list of receivers
    subject: 'CHOICE Goal Tracking Application Notification', // Subject line
    text: 'No message was entered.', // plain text body
    html: '<b>No message was entered.</b>' // html body
};

sendMail = function(){
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          return console.log(error);
      }
      // console.log('Message %s sent: %s', info.messageId, info.response);
      console.log('messageId:', info.messageId);
      console.log('response', info.response);
  });
};


//----- GET REQUESTS ------

// GET CLIENT DATA fROM DB
  /**
  /* @api {get} /tracking/getClients Retrieve client names and IDs
  * @apiName GetClients
  * @apiGroup Tracking
  *
  * @apiSuccess {Number} client_id  Client's ID from clients table
  * @apiSuccess {String} client_name Client's name from clients table
  * @apiSuccess {Number} staff_id Case manager id from staff table
  * @apiSuccess {String} staff_name Case manager names
  */
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
    "join users on users.staff_id = users.staff_id where users.id =" + req.user.id + "and staff.employed = true and client.active = true " +
    "and job_site.jobsite_status = true ORDER BY client_name;",
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

// GET CLIENTs without goals fROM DB
  /**
  /* @api {get} /tracking/getNoGoalClients Retrieve client names where they don't have a goal
  * @apiName GetClientsWithoutGoals
  * @apiGroup Tracking
  *
  * @apiSuccess {Number} client_id  Client's ID from clients table
  * @apiSuccess {String} client_name Client's name from clients table
  * @apiSuccess {Number} goal_id Goal's ID from the goal table
  * @apiSuccess {Number} staff_id Case manager id from staff table
  * @apiSuccess {String} staff_name Case manager names
  */
router.get('/getNoGoalClients', function(req, res) {
  console.log('in server getting no goal clients');
  console.log('CURRENT USER ID', req.user.id);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //join client, staff, and users to filter all cleints from user login
    client.query("select goal.id as goal_id, client.id as client_id, client_name, staff_name from client left join goal on goal.client_id = client.id join staff on client.staff_id = staff.id where goal.id is null;",
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

// GET latest goal_tracking submission
  /**
  /* @api {get} /tracking/getGoals/client_id Retrieve latest goal tracking data
  * @apiName GetLastTrackedData
  * @apiGroup Tracking
  *
  * @apiParam {Number} client_id  Client's ID from clients table
  *
  * @apiSuccess {String} am Indicates AM checkin
  * @apiSuccess {String} business_name Jobsite business name
  * @apiSuccess {String} client_name Client's name from clients table
  * @apiSuccess {Number} goalid Goal's ID from the goal table
  * @apiSuccess {String} goalname Name of the goal
  * @apiSuccess {String} goalnotes Notes for the goal
  * @apiSuccess {String} implementation_date Start date for goal tracking
  * @apiSuccess {String} lastUpdate Date of last entered goal tracking data
  * @apiSuccess {String} max_goal_date_am Last date AM tracking data entered
  * @apiSuccess {String} max_goal_date_pm Last date PM tracking data entered
  * @apiSuccess {String} staff_name Case manager names
  */
router.get('/getGoals/:id', function(req, res) {
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

// GET GOAL TRACKING DATA fROM DB
  /**
  /* @api {get} /tracking/getGoalHistory/goal_id Retrieve goal tracking data for a specific client
  * @apiName GetAllTrackingData
  * @apiGroup Tracking
  *
  * @apiParam {Number} goal_id  Goal ID to get data for
  *
  * @apiSuccess {String} am Indicates AM checkin
  * @apiSuccess {String} business_name Jobsite business name
  * @apiSuccess {String} client_name Client's name from clients table
  * @apiSuccess {Number} goalid Goal's ID from the goal table
  * @apiSuccess {String} goalname Name of the goal
  * @apiSuccess {String} goalnotes Notes for the goal
  * @apiSuccess {String} implementation_date Start date for goal tracking
  * @apiSuccess {String} lastUpdate Date of last entered goal tracking data
  * @apiSuccess {String} max_goal_date_am Last date AM tracking data entered
  * @apiSuccess {String} max_goal_date_pm Last date PM tracking data entered
  * @apiSuccess {String} staff_name Case manager names
  */
router.get('/getGoalHistory/:id', function(req, res) {
  console.log('in server getting goal history');
  console.log('with goal id', req.params.id);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //get goal history by goal id
    client.query("select * from goal_tracking where goal_id = " + req.params.id + " order by date_tracked DESC;",
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

//----- POST REQUESTS ------

// ADD GOAL TRACKING DATA fROM DB
  /**
  /* @api {post} /tracking/trackGoal Retrieve goal tracking data for a specific client
  * @apiName AddGoalTrackingData
  * @apiGroup Tracking
  *
  * @apiParam {Number} goal_id  Goal ID for goal to update
  * @apiParam {String} am_or_pm Indicates AM or PM checkin
  * @apiParam {String} complete_or_not Indicates if goal is: complete, incomplete, absent or na
  * @apiParam {Number} goalid Goal's ID from the goal table
  * @apiParam {String} goalnotes Notes for the goal
  * @apiParam {String} date_tracked Date the tracking data was entered
  * @apiParam {String} entered_by Name of the user who entered the tracking data
  */
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
    client.query("insert into goal_tracking(goal_id, am_or_pm, complete_or_not, notes, date_tracked, entered_by) values($1, $2, $3, $4, $5, $6);",
    [req.body.id, req.body.time, req.body.completion, req.body.notes, req.body.date, req.user.staff_name],
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


//----- DELETE REQUESTS ------

// DELETE GOAL TRACKING DATA FOR A SINGLE CHECKIN
/**
/* @api {get} /tracking/deleteEntry/goal_id Delete goal tracking data for a specific entry
* @apiName DeleteTrackingData
* @apiGroup Tracking
*
* @apiParam {Number} goal_id  Goal ID to get data for
*/
router.delete('/deleteEntry/:id', function(req, res) { //and latest goal_tracking submission
  console.log('in server deleting goal history entry');
  console.log('at goal history id: ', req.params.id); //client id
var id = req.params.id;
  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }

    client.query("DELETE from goal_tracking where id = $1", [id],
        function (err, result) {
          done();
          if(err) {
            console.log("Error deleting data: ", err);
            //next(err);
          } else {
            console.log('delete SUCCESS');
            res.sendStatus(200);
          }
    });
  });
});

//------- PUT ROUTES -----------

// SEND EMAIL NOTIFICATION TO ADMIN
/**
/* @api {put} /tracking/notifyAdmin Email notification to admin
* @apiName EmailAdmin
* @apiGroup Tracking
*
* @apiParam {Number} staff_id  Goal ID to get data for
* @apiParam {String} message  Message for email. Sent using req.body
*/
router.put('/notifyAdmin', function(req, res) {
  console.log('in notifyAdmin with:', req.body);
  console.log('req.user is:', req.user);
  var message = req.body.message;

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      //next(err);
    }
    //join goal, client, staff, job, job_site to find all goal date
    client.query("SELECT email from staff where role = 1 limit 1;",
        function (err, result) {
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            //next(err);
          } else {
            console.log('RESULT ROWS', result.rows);
            console.log('RESULTING EMAIL IS:', result.rows[0].email);

            // var mailOptions = {
            //     from: '"CHOICE" <foo@blurdybloop.com>', // sender address
            //     to: 'chasefu@yahoo.com', // list of receivers
            //     subject: 'CHOICE subject', // Subject line
            //     text: 'Hello world? Where is this going?', // plain text body
            //     html: '<b>GameNight emailing is working on Thursday morning!</b>' // html body
            // };

            mailOptions.to = result.rows[0].email;
            mailOptions.html = req.user.staff_name + " has sent you the following notification via the CHOICE, Inc goal tracking application:<br><br>" + message;
            sendMail();

              res.sendStatus(201);
          }
    });
  });
});

// Updates a goal history entry
  /**
  /* @api {put} /tracking/updateHistory Update goal tracking data for a specific checkin
  * @apiName UpdateGoalTrackingData
  * @apiGroup Tracking
  *
  * @apiParam {Number} goal_id  Goal ID for goal to update
  * @apiParam {String} am_or_pm Indicates AM or PM checkin
  * @apiParam {String} complete_or_not Indicates if goal is: complete, incomplete, absent or na
  * @apiParam {String} goalnotes Notes for the goal
  */
router.put('/updateHistory/', function(req, res){
  console.log('in updateHistory with:', req.body);

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
    }
    client.query("UPDATE goal_tracking SET am_or_pm = $1,complete_or_not = $2, notes = $3 WHERE id = $4;",
      [req.body.am_or_pm, req.body.complete_or_not, req.body.notes, req.body.id],
        function (err, result) {
          done();
          if(err) {
            console.log("Error inserting data: ", err);
            res.sendStatus(420);
            //next(err);
          } else {
            res.sendStatus(202);
          }
        });
  });
});

module.exports = router;
