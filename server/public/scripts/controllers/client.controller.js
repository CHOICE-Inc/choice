myApp.controller('ClientController', function($http, $mdToast, $location, UserService, GoalService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.goalService = GoalService;
  vm.editStatus = false;
  vm.clientToAdd = {};
  vm.clientToEdit = {};
  vm.staffArray=[];


  getClients();
  getStaff();


  // gets list of clients
  function getClients(){

    console.log('in getClients');
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
      vm.clientArray = response.data;

    });
  }


 // gets list of staff
  function getStaff(){
    console.log('in getSt');
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

  // updates client information
  vm.updateClient = function(client){
    console.log('in updateClient with:', client);

    $http.put('/client/updateClient/', client).then(function(response){

      console.log('got response from updateClient PUT');
      getClients();
    });
  };

vm.addNewClient = function(){
  console.log('in addNewClient');
  $http.post('/client/addClient/', vm.clientToAdd).then(function(response){
    console.log('received response from addNewClient POST');
    vm.clientToAdd = {};
    getClients();
  });

};

});
