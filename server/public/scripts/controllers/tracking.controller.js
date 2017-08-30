myApp.controller('TrackingController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.dataList = [];
  vm.clientList = [];
  vm.locationList = [];
  vm.caseManagers = [];
  vm.clientGoals = [];
  vm.clientToView = {};
  vm.trackingData = {};
  vm.today = new Date();
  vm.filters = ['Show All', 'Location', 'Case Manager', 'Option 3', 'Option 4', 'Option 5'];


  // builds list of clients to display on goal tracking page
  buildLists = function(data){
    console.log('in buildClientList with:', data);
    var names = [];
    var locations = [];
    var cms = [];
    for(var i = 0; i < data.length; i++){
      if(!names.includes(data[i].client_name)){
        vm.clientList.push(data[i]);
        names.push(data[i].client_name);
      }
      if(!locations.includes(data[i].business_name)){
        vm.locationList.push(data[i].business_name);
        locations.push(data[i].business_name);
      }
      if(!cms.includes(data[i].staff_name)){
        vm.caseManagers.push(data[i].staff_name);
        cms.push(data[i].staff_name);
      }
    }
  };


  //ted stuff
  getClients();


  // gets list of clients
  function getClients(){
    $http.get('/tracking/getClients').then(function(response) {
      console.log(response.data);
      vm.dataList = response.data;
      buildLists(vm.dataList);
      console.log('vm.clientList:',vm.clientList);
      console.log('vm.locationList:',vm.locationList);
      console.log('vm.caseManagers:',vm.caseManagers);

    });

  }
  //end ted stuff

  // gets client goals
  vm.showClientGoals = function(client){
    console.log('in showClientGoals with client:', client);
    vm.clientToView = client;
    $http.get('/tracking/getGoals/' + client.clientid).then(function(response) {
      console.log('getGoals response:',response.data);
      vm.clientGoals = response.data;
    });
  };

  // filters client list based on filter options
  vm.filterClients = function(data){
    var tempList = angular.copy(data);

    console.log('in filterClients with data:', data);
    console.log('in filterClients with CM:', vm.filterCm);
    console.log('in filterClients with JS:', vm.filterJs);

    if(vm.caseManagers.includes(vm.filterCm)){
      for(var i = 0; i < tempList.length; i++){
        if(tempList[i].staff_name != vm.filterCm){
          tempList.splice(i,1);
          i--;
        }
      }
    }
    if(vm.locationList.includes(vm.filterJs)){
      for(var p = 0; p < tempList.length; p++){
        if(tempList[p].business_name != vm.filterJs){
          tempList.splice(p,1);
          p--;
        }
      }
    }
    console.log('tempList is:',tempList);
    console.log('data is:', data);
    var names = [];
    vm.clientList = [];
    for(var x = 0; x < tempList.length; x++){
      if(!names.includes(tempList[x].client_name)){
        vm.clientList.push(tempList[x]);
        names.push(tempList[x].client_name);
      }
    }
  }; // end filterClients


  // submits goal tracking data
  vm.trackGoal = function(goalId, amOrPm, completion){
    //need date
    console.log('in trackGoal');
    var goalData = {
      id: goalId,
      time: amOrPm,
      completion: completion,
      date: new Date().toString(),
    };
    console.log('sending goalData:', goalData);
    $http.post('/tracking/trackGoal/', goalData).then(function(response){
      console.log('Received response from trackGoal POST:', response);
    });
  };

  vm.toGoalCriteria = function(id){
    console.log('in toGoalCriteria with id:', id);
  };

  vm.toGoalHistory = function(id){
    console.log('in toGoalHistory with id:', id);
  };




});
