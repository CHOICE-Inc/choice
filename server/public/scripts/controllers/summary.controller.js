myApp.controller('SummaryController', function(UserService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  console.log('user object', vm.userObject);
});
