myApp.factory('GoalService', function($http, $location, $mdDialog){
  console.log('GoalService Loaded');

  var allGoalData = {};

  return {

    allGoalData: allGoalData,

    // GET single goal data using client_id and goal_id



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
      }






  }; //end of return

}); // end of factory
