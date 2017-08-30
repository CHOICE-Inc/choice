myApp.controller('StaffController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.message = "hello mate";

  getStaff();

  function getStaff(){
    $http.get('/staff/getStaff').then(function(response) {
      console.log(response.data);

      for(i=0;i<response.data.length; i++){
        if(response.data[i].employed === true){
          response.data[i].toggle = 'Deactivate';
        }
        else if (response.data[i].employed === false){
          response.data[i].toggle = 'Activate';
        }
      }

      vm.staffArray = response.data;


    });
  }

  vm.toggleEmployee = function(toggle){
    console.log('changed from', toggle);

  }
});
