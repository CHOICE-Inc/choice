var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('./strategies/sql.localstrategy');
var sessionConfig = require('./modules/session.config');

// Route includes
var indexRouter = require('./routes/index.router');
var userRouter = require('./routes/user.router');
var registerRouter = require('./routes/register.router');
var goalRouter = require('./routes/goal.router');
var trackingRouter = require('./routes/tracking.router');
var jobSitesRouter = require('./routes/jobSites.router');
var staffRouter = require('./routes/staff.router');
var summaryRouter = require('./routes/summary.router');
var clientRouter = require('./routes/client.router');

var port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/goal', goalRouter);
app.use('/tracking', trackingRouter);
app.use('/staff', staffRouter);
app.use('/jobsites', jobSitesRouter);
app.use('/summary', summaryRouter);
app.use('/client', clientRouter);

// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, function(){
   console.log('Listening on port:', port);
});
