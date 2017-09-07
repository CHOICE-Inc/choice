myApp.controller('HomeController', function(UserService) {
  console.log('HomeController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
});
