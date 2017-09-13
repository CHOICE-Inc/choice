myApp.controller('NavController', function(UserService) {

  console.log('NavController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

}); //end of controller
