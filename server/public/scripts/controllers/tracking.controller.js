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



function getClients(){
  $http.get('/tracking/getCgit lients').then(function(response) {
    console.log(response.data);
    vm.dataList = response.data;
    buildLists(vm.dataList);
console.log('vm.clientList:',vm.clientList);
console.log('vm.locationList:',vm.locationList);
console.log('vm.caseManagers:',vm.caseManagers);

  });

}
//end ted stuff

vm.showClientGoals = function(client){
  console.log('in showClientGoals with client:', client);
  vm.clientToView = client;
  $http.get('/tracking/getGoals/' + client.clientid).then(function(response) {
    console.log('getGoals response:',response.data);
    vm.clientGoals = response.data;
  });
};

vm.filterClients = function(option){
    console.log('in filterClients with:', option);

};





});
