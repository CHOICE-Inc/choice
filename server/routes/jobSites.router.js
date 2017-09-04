var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');


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

module.exports = router;
