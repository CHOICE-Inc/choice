myApp.factory('GoalService', function($http, $location, $mdDialog){
  console.log('GoalService Loaded');

  var allGoalData = {};
  var singleGoal = {};


  return {

    allGoalData: allGoalData,
    singleGoal: singleGoal,

    //Move from goal tracking to view selected goal's criteria
    viewGoalCriteria: function(goal_id, client_id) {
      //load client_id and goal_id variables
      console.log('in toGoalCriteria with goal.id:', goal_id);
      console.log('in toGoalCriteria with client.id:', client_id);

      //Get goal for those variables
      var config = {params: {
                          goal_id: goal_id,
                          client_id: client_id
                    }};
      $http.get("/goal/singlecriteria", config).then(function(response) {
        //console.log("Get one goal from DB: ", response.data);
        singleGoal.data = response.data[0];
        console.log("Get single goal from DB: ", singleGoal.data);

        //Redirect to goalView.html & pass values
        $location.path("/viewGoal");

      });
    } //end of toGoalCriteria




  }; //end of return

}); // end of factory
