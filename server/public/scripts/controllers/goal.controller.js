myApp.controller('GoalController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.clientData = [];
  vm.jobSiteData = [];
  var goal = {};

// GET REQUEST TO RETIEVE CLIENT NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
// Route: /goal/clients
function getClients() {
  $http.get('/goal/clients').then(function(response) {
    console.log("clients response:", response.data);
    vm.clientData = response.data;
  });
}
getClients();
//CONVERT CLIENT NAME TO CLIENT ID
vm.assignClientID = function (id){
  console.log("assignClient id: ", id);
  goal.client_id = id;
};

// GET REQUEST TO RETIEVE JOB SITE NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
// Route: /goal/jobsites

function getJobSites() {
  $http.get('/goal/jobsites').then(function(response) {
    console.log("Job Site response:", response.data);
    vm.jobSiteData = response.data;
  });
}
getJobSites();
//CONVERT JOB NAME TO JOBSITE ID
vm.assignJobsiteId = function (id){
  console.log("assignJobsiteId id: ", id);
  goal.jobsite_id = id;
};

// POST NEW CRITERIA TO THE DB

// RETRIVE GOAL CRITERIA DATA FROM DOM
vm.saveCriteria = function(implementation_date, review_dates, completion_date,
  service_outcome, objective, behavior_technique, modifications, equipment,
  when_notes, plan_steps) {
    goal.implementation_date = implementation_date;
    goal.review_dates = review_dates;
    goal.completion_date = completion_date;
    goal.service_outcome = service_outcome;
    goal.objective = objective;
    goal.behavior_technique = behavior_technique;
    goal.modifications = modifications;
    goal.equipment = equipment;
    goal.when_notes = when_notes;
    goal.plan_steps = plan_steps;
    console.log("goal: ", goal);
};

// GET SINGLE CRITERIA FROM THE DB BASED ON GOAL_ID


// UPDATE SINGEL CRITERIA IN DB USING GOAL_ID


// "DELETE" CRITERIA BY CHANGING GOAL_STATUS TO FALSE & DISABLING IT





}); //end of controller
