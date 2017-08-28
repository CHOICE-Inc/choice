myApp.controller('TrackingController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.clientList = [];
  vm.clientGoals = [];
  vm.clientToView = {};
  vm.filters = ['Show All', 'Location', 'Case Manager', 'Option 3', 'Option 4', 'Option 5'];



//ted stuff
getClients();

function getClients(){
  $http.get('/tracking/getClients').then(function(response) {
    console.log(response.data);
    vm.clientList = response.data;
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
console.log('end showClientGoals');
};

vm.filterClients = function(option){
    console.log('in filterClients with:', option);

};





});
