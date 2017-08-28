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
    implemented_by: implemented_by,
    behavior_technique: behavior_technique,
    modifications: modifications,
    equipment: equipment,
    when_notes: when_notes
  };



});
