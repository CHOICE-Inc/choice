myApp.controller('StaffController', function(UserService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.message = "hello mate";

  getStaff();

  function getStaff(){
    $http.get('/staff/getStaff').then(function(response) {
      console.log(response.data);
    });
  }
});
