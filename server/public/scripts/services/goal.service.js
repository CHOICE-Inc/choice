myApp.factory('GoalService', function($http, $location, $mdDialog){
  console.log('GoalService Loaded');

  var allGoalData = {};
  var singleGoal = {};


  return {

    allGoalData: allGoalData,
    singleGoal: singleGoal,

    // GET single goal data using client_id and goal_id
  /*  getGoalCriteria : function(goal_id, client_id) {
      var oneGoalData = {client_id: client_id};
      console.log("oneGoalData is: ", oneGoalData);
      console.log("using client_id: ", client_id, "looking at goal: ", goal_id);

      var config = {params: {
                          goal_id: goal_id,
                          client_id: client_id
                    }};
      return $http.get("/goal/singlecriteria", config).then(function(response) {
        //console.log("Get one goal from DB: ", response.data);
        singleGoalData = response.data[0];
        console.log("Get single goal from DB: ", singleGoalData);
        return singleGoalData;
      });
    },*/

    //GET * ALL * CRITERIA DATA FOR A SPECIFIC USER FROM THE DB
      //Will be called by other functions to do logic upon that data
      getAllGoals : function(client_id){
        //GET request to get all the goals available for the client_id
         return $http.get('/goal/allCriteria/' + client_id).then(function(response){
          console.log('Get all criteria for: ', client_id, 'Gives response: ', response.data);
        //Assign that data to vm.allGoalData
          allGoalData.data = response.data;
          console.log('assigning response data to all allGoalData: ', allGoalData);
        return response;
        });
      },

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
