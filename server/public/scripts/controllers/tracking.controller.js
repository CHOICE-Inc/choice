myApp.controller('TrackingController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
//ted stuff
getClients();

function getClients(){
  $http.get('/tracking/getClients').then(function(response) {
    console.log(response.data);
  });
}
//end ted stuff

});
