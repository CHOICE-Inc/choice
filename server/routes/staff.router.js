var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.get('/getStaff', function(req, res) {
  console.log('in server getting dem staff');

  pool.connect(function(err, client, done, next) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    //join client, staff, and users to filter all cleints from user login
    client.query("select * from staff join users on users.staff_id = staff.id",
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

module.exports = router;
