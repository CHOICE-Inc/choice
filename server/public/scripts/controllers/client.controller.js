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

  // ----------GET ROUTES------------

  //GET all Clients in the DB and display on the DOM
  /**
  * @api {get} /clients/getClients Retrieve ALL clients names and IDs
  * @apiName GetAllClients
  * @apiGroup RetrieveData
  *
  * @apiSuccess {Boolean} active Client's active status (is inactive if no longer w/ Choice)
  * @apiSuccess {String} client_name Clients's name
  * @apiSuccess {Number} clientid Client ID from client table
  * @apiSuccess {Boolean} editing Indicates editing status for the input fields
  * @apiSuccess {Number} staff_id Case Managers's ID from staff table
  * @apiSuccess {String} staff_name Case Manager's name
  * @apiSuccess {String} status Label for edit button "Deactive" / "Activate"
  */
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
  /**
  * @api {get} /staff/getAllCM Retrieve ALL case manager names and IDs
  * @apiName GetAllCaseManagers
  * @apiGroup RetrieveData
  *
  * @apiSuccess {String} email Case Managers's email
  * @apiSuccess {Boolean} employed Indicates employment status (true = employed)
  * @apiSuccess {Number} id ID of listing from staff table
  * @apiSuccess {Number} staff_id Case Managers's ID from staff table
  * @apiSuccess {String} staff_name Case Manager's name
  */
  function getStaff(){
    console.log('in getSt');
    $http.get('/staff/getAllCM').then(function(response) {
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

  // ----------POST ROUTES------------

  //POST a new client to the DB and display on the DOM
  /**
  * @api {post} /clients/addClient Add a new client to the database
  * @apiName PostClient
  * @apiGroup AddData
  *
  * @apiParam {String} client_name Clients's name
  * @apiSuccess {Number} staff_id Case Managers's ID from staff table
  * @apiSuccess {String} staff_name Case Manager's name
  */
  vm.addNewClient = function(){
    console.log('in addNewClient');
    $http.post('/client/addClient/', vm.clientToAdd).then(function(response){
      console.log('received response from addNewClient POST');
      swal(
        'Success!',
        'A new participant has been created.',
        'success'
      );
      vm.clientToAdd = {};
      getClients();
    }).catch(function(){
      console.log('ERROR ERROR ERROR ERROR');
      swal(
        'Error adding new participant.',
        'Make sure all required information has been entered!',
        'error'
      );
    });
  };

  // ----------PUT ROUTES------------

  //updates client information
  /**
  * @api {put} /clients/updateClient Updates client's names in the database
  * @apiName GetAllClients
  * @apiGroup UpdateData
  *
  * @apiParam {Number} client Clients's unique ID
  */
  vm.updateClient = function(client){
    console.log('in updateClient with:', client);

    $http.put('/client/updateClient/', client).then(function(response){

      console.log('got response from updateClient PUT');
      swal(
        'Success!',
        'Participant information has been updated.',
        'success'
      );
      getClients();
    }).catch(function(){
      swal(
        'Error updating participant.',
        'Make sure all required information has been entered!',
        'error'
      );
    });
  };

}); //end of controller
