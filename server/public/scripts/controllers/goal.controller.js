myApp.controller('GoalController', function(UserService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  //DATA OBJECT TO SEND TO SERVER-SIDE
  var goal = {
    client_id: client_id,
    jobsite_id: jobsite_id,
    implementation_date: implementation_date,
    review_dates: review_dates,
    completion_date: completion_date,
    service_outcome: service_outcome,
    objective: objective,
    behavior_technique: behavior_technique,
    modifications: modifications,
    equipment: equipment,
    when_notes: when_notes,
    plan_steps: plan_steps
  };

// GET REQUEST TO RETIEVE CLIENT NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
// Route: /goal/clients



// GET REQUEST TO RETIEVE JOB SITE NAMES AND IDs fROM DB TO POPULATE PULLDOWN MENU / AUTOCOMPLETE
// Route: /goal/jobsites

// POST NEW CRITERIA TO THE DB
  //CONVERT CLIENT NAME TO CLIENT ID


// GET SINGLE CRITERIA FROM THE DB BASED ON GOAL_ID


// UPDATE SINGEL CRITERIA IN DB USING GOAL_ID


// "DELETE" CRITERIA BY CHANGING GOAL_STATUS TO FALSE & DISABLING IT





}); //end of controller
