myApp.controller('GoalController', function($http, $location, UserService, GoalService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.goalService = GoalService;

  vm.clientData = [];
  vm.jobSiteData = [];
  vm.casemanagerData = [];
  vm.allGoalData = [];
  vm.singleGoal = GoalService.singleGoal;
  var goal = {}; //data object being built and sent to server


/*----- GET ROUTES -----*/

// GET REQUEST TO RETIEVE CLIENT NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
  function getClients() {
    $http.get('/goal/clients').then(function(response) {
      console.log("clients response:", response.data);
      vm.clientData = response.data;
    });
  }
  getClients();

// GET REQUEST TO RETIEVE CASE MANAGER NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
  function getCaseManagers() {
    $http.get('/goal/casemanager').then(function(response) {
      console.log("case managers response: ", response.data);
      vm.casemanagerData = response.data;
    });
  }
  getCaseManagers();


// GET REQUEST TO RETIEVE JOB SITE NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
  function getJobSites() {
    $http.get('/goal/jobsites').then(function(response) {
      console.log("Job Site response:", response.data);
      vm.jobSiteData = response.data;
    });
  }
  getJobSites();

//GET * ALL * CRITERIA DATA FOR A SPECIFIC USER FROM THE DB
  function getAllGoals (client_id){
    //GET request to get all the goals available for the client_id
    return $http.get('/goal/allCriteria/' + client_id).then(function(response){
      console.log('Get all criteria for: ', client_id, 'Gives response: ', response.data);
      //Assign that data to vm.allGoalData
      vm.allGoalData = response.data;
      console.log('assigning response data to all allGoalData: ', vm.allGoalData);
      return response;
    });
  }

// GET SINGLE CRITERIA FROM THE DB BASED ON GOAL_ID
  vm.getGoalCriteria = function(goal_id, client_id) {
    var oneGoalData = {client_id: client_id};
    console.log("oneGoalData is: ", oneGoalData);
    console.log("using client_id: ", client_id, "looking at goal: ", goal_id);

    var config = {params: {
      goal_id: goal_id,
      client_id: client_id
    }};
    $http.get("/goal/singlecriteria", config).then(function(response) {
      console.log("Get one goal from DB: ", response.data);
      var goalData = response.data[0];
      vm.assignData(goalData);
    });
  };


/*------- POST REQUESTS ---------*/

// POST NEW CRITERIA TO THE database
  vm.saveCriteria = function(implementation_date, review_dates, completion_date,
    service_outcome, objective, behavior_techniques, modifications, equipment, jobsite_details,
    when_notes, plan_steps,goal_name, goal_summary) {
      // RETRIVE GOAL CRITERIA DATA FROM DOM
      goal.implementation_date = implementation_date;
      goal.review_dates = review_dates;
      goal.completion_date = completion_date;
      goal.service_outcome = service_outcome;
      goal.objective = objective;
      goal.behavior_techniques = behavior_techniques;
      goal.modifications = modifications;
      goal.equipment = equipment;
      goal.jobsite_details = jobsite_details;
      goal.when_notes = when_notes;
      goal.plan_steps = plan_steps;
      goal.goal_name = goal_name;
      goal.goal_summary = goal_summary;
      console.log("goal: ", goal);

      $http.post('/goal', goal).then(function(response) {
        console.log('sending goal data to db: ');
        if (response) {
          console.log('server sent something back: ', response);
          swal(
            'Success!',
            'New goal created.',
            'success'
          );
          var data = {};
          vm.assignData(data);
        }
      }).catch(function(){
        swal(
          'There was an error creating this goal.',
          'Check that all required information has been entered.',
          'error'
        );
      });
    };

/*----- PUT REQUESTS ------*/
  // UPDATE SINGLE CRITERIA IN DB USING GOAL_ID
    vm.updateCriteria = function(client_id, jobsite_id, implementation_date, review_dates, completion_date,
      service_outcome, objective, behavior_techniques, modifications, equipment, jobsite_details,
      when_notes, plan_steps,goal_name, goal_summary, goal_id) {
        console.log('Updating goal w/ id of: ', goal_id);

        // RETRIVE GOAL CRITERIA DATA FROM DOM
        goal.client_id = client_id;
        goal.jobsite_id = jobsite_id;
        goal.implementation_date = implementation_date;
        goal.review_dates = review_dates;
        goal.completion_date = completion_date;
        goal.service_outcome = service_outcome;
        goal.objective = objective;
        goal.behavior_techniques = behavior_techniques;
        goal.modifications = modifications;
        goal.equipment = equipment;
        goal.jobsite_details = jobsite_details;
        goal.when_notes = when_notes;
        goal.plan_steps = plan_steps;
        goal.goal_name = goal_name;
        goal.goal_summary = goal_summary;
        console.log("goal: ", goal);

        //PUT request to update DB
        $http.put('/goal/' + goal_id, goal).then(function(response) {
          console.log('sending goal data to db: ');
          if (response) {
            console.log('server sent something back: ', response);
            swal(
              'Success!',
              'Goal successfully updated.',
              'success'
            );

          }
        }).catch(function(){
          swal(
            'There was an error updating the goal.',
            'Check that all required information has been entered.',
            'error'
          );
        });
      };

  // "DELETE" CRITERIA BY CHANGING GOAL_STATUS TO FALSE & DISABLING IT
      vm.disableCriteria = function(goal_id, boolean, client_id) {
        console.log('Goal criteria id to disable: ', goal_id);
        console.log('This goal\'s status: ', boolean);
        $http.put('/goal/disable/' + goal_id + '/' + boolean).then(function(response){
          console.log('Disable criteria response: ', response);
          swal(
            'Updated!',
            'Goal status has been updated.',
            'success'
          );
          vm.getGoalCriteria(goal_id, client_id);

        });
      }; //end of disable function

/*------ FUNCTIONALITY FOR AUTOCOMPLETE CLIENT NAME SEARCH -----*/
      vm.querySearch = function(query) {
        vm.clients = loadAll();
        console.log('Looking for: ', query);
        var results = query ? vm.clients.filter ( createFilterFor (query) ) : vm.clients,
        deferred;
        // ? and : act as if-else statement: if query is true, results = filtered text, else results = vm.clients
        return results;
      };
      // Build 'client' list of key/value pairs
      function loadAll() {
        getClients();
        var clients = vm.clientData;
        console.log('Client data: ', vm.clientData);

        return clients.map( function (client) {
          client.value = client.client_name.toLowerCase();
          return client;
        });
      }
      //Create filter function for a query string
      function createFilterFor (query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(item) {
          return (item.value.indexOf(lowercaseQuery) === 0);
        };
      }

    /*------- FUNCTIONS W/O HTTP REQUESTS -----*/
        //CONVERT CLIENT NAME TO CLIENT ID for use in data object being sent w/ POST request
        vm.assignIds = function (client){
          console.log("assignClient client: ", client);
          goal.client_id = client.id;
          vm.casemanager_id = client.staff_id;
          vm.casemanager = client.staff_name;
        };

        //CONVERT JOB NAME TO JOBSITE ID
        vm.assignJobsiteId = function (id){
          console.log("assignJobsiteId id: ", id);
          goal.jobsite_id = id;
        };

        //WHEN USER CLICKS A CLIENT'S NAME, AUTOPOPULATE PULLDOWN MENU FOR AVAILABLE GOALS
        vm.getClientGoals = function(client) {
          console.log('Client to retrieve goals for: ', client);
          vm.casemanager = client.staff_name;
          console.log('vm.casemanager is:', vm.casemanager);

          //GET request to get all the goals available for the client_id
          getAllGoals(client.id);
          console.log('Goals for that client include: ', vm.allGoalData);
          //Display the goal "names" for each one in the pulldown menu
        };

        vm.getOneGoal = function(id) {
          console.log("Get One Goal: ", id);
          goal.oneGoal_id = id;
        };

        // GO BACK TO TRACKING PAGE -- ON VIEW GOAL PAGE
        vm.goBackToTracking =  function(goal_id, client_id){
          //Relocate to editGoal.html
          $location.path("/tracking");
        };

        //ASSIGNING GOAL DATA TO THE DOM
          vm.assignData = function (dataObject) {
            console.log('in assignData with:', dataObject);
            vm.client_id = dataObject.client_id;
            vm.clientName = dataObject.client_name;
            //console.log("response data name is: ", dataObject.client_name);
            vm.jobSite = dataObject.business_name;
            vm.implementation_date = dataObject.implementation_date;
            vm.review_dates = dataObject.review_dates;
            vm.completion_date = dataObject.completion_date;
            vm.service_outcome = dataObject.service_outcome;
            vm.objective = dataObject.objective;
            vm.jobsite_details = dataObject.jobsite_details;
            vm.when_notes = dataObject.when_notes;
            vm.equipment = dataObject.equipment;
            vm.behavior_techniques = dataObject.behavior_techniques;
            vm.modifications = dataObject.modifications;
            vm.plan_steps = dataObject.plan_steps;
            vm.goal_name = dataObject.goal_name;
            vm.goal_summary = dataObject.goal_summary;
            vm.goal_id = dataObject.goalid;
            vm.goal_status = dataObject.goal_status;
            vm.jobsite_id = dataObject.jobsite_id;
            vm.staff_id = dataObject.staff_id;
            vm.staff_name = dataObject.staff_name;
          };

    }); //end of controller
