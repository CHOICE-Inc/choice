var express = require('express');
var router = express.Router();

// RETIEVE JOBSITE ID IN EXCHANGE FOR A JOBSITE NAME FROM THE CLIENT
router.get('/getID/:name', function(req, res){
  console.log('In get route for job sites to find id for name: ', req.params.name);

  pool.connect(function(errConnectingToDatabase, db, done){
    if(errConnectingToDatabase) {
      console.log('There was an error connecting to database: ', errConnectingToDatabase);
      res.sendStatus(500);
    } else {
      // MAKE DB QUERY
      db.query('SELECT id as jobsite_id FROM job_site WHERE business_name=$1 ', [req.params.name], function(errMakingQuery, result){
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

module.exports = router;
