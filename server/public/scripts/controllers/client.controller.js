myApp.controller('ClientController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.editStatus = false;

  vm.message = "hello mate";
  vm.locationArray = ['Eden Prairie', 'Maple Grove', 'Minnetonka'];

  getClients();
  getStaff();


  // gets list of clients
  function getClients(){
    var activeClients =[ ];
    var inactiveClients = [];
    console.log('refresh Staff members');
    $http.get('/client/getClients').then(function(response) {
      console.log(response.data);


      for(i=0;i<response.data.length; i++){ //add a new object property based on the status for each employee
        response.data[i].editing = false;
        if(response.data[i].active === true){
          response.data[i].status = 'Active';
        }
        else if (response.data[i].active === false){
          response.data[i].status = 'Inactive';
        }
      }


      var tempArray = response.data;
      for(var x = 0; x < tempArray.length; x++){
        if(tempArray[x].active == true){
          activeClients.push(tempArray[x]);
        } else {
          inactiveClients.push(tempArray[x]);
        }
      }

      activeClients.sort(function(a, b){
    if(a.client_name < b.client_name) return -1;
    if(a.client_name > b.client_name) return 1;
    return 0;
      });

      inactiveClients.sort(function(a, b){
    if(a.client_name < b.client_name) return -1;
    if(a.client_name > b.client_name) return 1;
    return 0;
      });

      vm.clientArray = angular.copy(activeClients);

      for(var p = 0; p < inactiveClients.length; p++){
        vm.clientArray.push(inactiveClients[p]);

      }


    });
  }


 // gets list of staff
  function getStaff(){
    console.log('refresh Staff members');
    $http.get('/staff/getAllStaff').then(function(response) {
      console.log(response.data);

      vm.staffArray = response.data;
      console.log('staff array is:', vm.staffArray);


    });
  }

  // sets client status to being edited
  vm.toggleEditing = function(client){
    console.log('in toggleEditing');
    vm.clientToEdit = client;
    client.editing = !client.editing;
    vm.editStatus = !vm.editStatus;
  };


// REMOVE??
  vm.toggleClientStatus = function(boolean, id){
    console.log('changed from', boolean, 'for staff id', id);
    $http.put('/client/updateClient/' + id + '/' + boolean).then(function(response){
      console.log(response.data);
      getClients();
    });
  };

  // filters staff list in client editing to only list staff per location entered
  vm.getStaffList = function(){
    var filteredStaffArray = [];
    for(var i = 0; i < vm.staffArray.length; i++){
      if(vm.staffArray[i].location == vm.clientToEdit.location){
        filteredStaffArray.push(vm.staffArray[i]);
      }
    }
    return filteredStaffArray;
  };

  // updates client information
  vm.updateClient = function(client){
    console.log('in updateClient with:', client);

    $http.put('/client/updateClient/', client).then(function(response){

      console.log('got response from updateClient PUT');
      getClients();
    });
  };


});
