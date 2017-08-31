myApp.controller('StaffController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.message = "hello mate";

  getStaff();

  function getStaff(){
    console.log('refresh Staff members');
    $http.get('/staff/getStaff').then(function(response) {
      console.log(response.data);

      for(i=0;i<response.data.length; i++){
        if(response.data[i].employed === true){
          response.data[i].status = 'Deactivate';
        }
        else if (response.data[i].employed === false){
          response.data[i].status = 'Activate';
        }
      }
      vm.staffArray = response.data;
    });
  }

  vm.updateEmployee = function(boolean, id){
    console.log('changed from', boolean, 'for staff id', id);
    $http.put('/staff/updateStaff/' + id + '/' + boolean).then(function(response){
      console.log(response.data);
      getStaff();
    });
  };
});
