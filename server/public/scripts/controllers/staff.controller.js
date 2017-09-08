myApp.controller('StaffController', function($http, $mdToast, $location, UserService, GoalService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.goalService = GoalService;
  vm.editStatus = false;
  vm.roles = ['Administrator', 'Case Manager', 'Staff'];


  getStaff();

  // Get list of staff members
  function getStaff(){
    console.log('refresh Staff members');
    $http.get('/staff/getStaff').then(function(response) {
      console.log(response.data);

      for(i=0;i<response.data.length; i++){ //add a new object property based on the status for each employee
        if(response.data[i].employed === true){
          response.data[i].status = 'Active';
        }
        else if (response.data[i].employed === false){
          response.data[i].status = 'Inactive';
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

  // Add a new staff member
  vm.addNewStaff = function(){
    console.log('added a new employee', vm.staffToAdd);
    $http.post('/staff/newStaff/', vm.staffToAdd).then(function(response){
      swal(
'Success!',
'A new staff member has been created.',
'success'
);
      console.log('received response from addNewStaff POST');
      vm.staffToAdd = {};
      getStaff();
    }).catch(function(){
      swal(
  'Error adding new staff.',
  'Make sure all required information has been entered!',
  'error'
);
    });
  };

  // Update information on existing staff member
  vm.updateStaff = function(staff){
    console.log('in updateStaff, sending:', staff);
    $http.put('/staff/updateStaff/', staff).then(function(response){
      console.log(response.data);
      swal(
'Success!',
'Staff member information has been updated.',
'success'
);
      getStaff();
    }).catch(function(){
      swal(
  'Error updating staff.',
  'Make sure all required information has been entered!',
  'error'
);
    });
  };

  // Toggles the display of editable content, and assigns the staffmember to be edited
  vm.toggleEditing = function(staff){
    console.log('in toggleEditing with staff:', staff);
    vm.staffToEdit = staff;
    staff.editing = !staff.editing;
    vm.editStatus = !vm.editStatus;
  };


});
