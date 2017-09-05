myApp.controller('StaffController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.message = "hello mate";

  vm.employee = {
    name: '',
    location: '',
    email: '',
    role : ''
  };

  vm.roles = [
    {role: "Administrator", type: 1},
    {role: "Case Manager", type: 2},
    {role: "Staff", type: 3}
  ];

  vm.location = [
    {place: 'Eden Prairie'},
    {place: 'Bloomington'},
    {place: 'Maple Grove'}
  ];

  getStaff();

  function getStaff(){
    console.log('refresh Staff members');
    $http.get('/staff/getStaff').then(function(response) {
      console.log(response.data);

      for(i=0;i<response.data.length; i++){ //add a new object property based on the status for each employee
        if(response.data[i].employed === true){
          response.data[i].status = 'Deactivate';
        }
        else if (response.data[i].employed === false){
          response.data[i].status = 'Activate';
        }
      }

      for(i=0;i<response.data.length;i++){//display role String based on role integer
        if(response.data[i].role == 1){
          response.data[i].roleString = "Administrator";
        } else if(response.data[i].role == 2){
          response.data[i].roleString = "Case Manager";
        } else if(response.data[i].role == 3){
          response.data[i].roleString = "Staff";
        } else {
          response.data[i].role = 0;
          response.data[i].roleString = "Not assigned yet.";
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

  vm.newEmployee = function(){
    console.log('added a new employee', vm.employee);
    $http.post('/staff/newStaff/', vm.employee).then(function(response){
      console.log(response.data);
      getStaff();
    });
  };

});
