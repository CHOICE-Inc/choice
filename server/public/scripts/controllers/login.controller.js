myApp.controller('LoginController', function($http, $location, UserService) {
    console.log('LoginController created');
    var vm = this;
    vm.user = {
      username: '',
      password: ''
    };
    vm.message = '';

    vm.login = function() {
      console.log('LoginController -- login');
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Enter your username and password!";
      } else {
        console.log('LoginController -- login -- sending to server...', vm.user);
        $http.post('/', vm.user).then(function(response) {
          if(response.data.username) {
            console.log('LoginController -- login -- success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/summary'); // http://localhost:5000/#/summary
          } else {
            console.log('LoginController -- login -- failure: ', response);
            vm.message = "Wrong!!";
          }
        }).catch(function(response){
          console.log('LoginController -- registerUser -- failure: ', response);
          vm.message = "Wrong!!";
        });
      }
    };

    vm.registerUser = function() {
      console.log('LoginController -- registerUser');
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Choose a username and password!";
      } else {
        console.log('gonna check for the username');

        //check existing staff
        $http.post('/register/check/', vm.user).then(function(response) {//check for existing username
          console.log('checked the staff table.', response.data[0]);
          if(response.data.length > 0){
            vm.user.staff_id = response.data[0].id;
            console.log('LoginController -- registerUser -- sending to server...', vm.user);
            $http.post('/register', vm.user).then(function(response) {
              console.log('LoginController -- registerUser -- success');
              $location.path('/home');
            }).catch(function(response) {
              console.log('LoginController -- registerUser -- error');
              vm.message = "Please try again.";
            });
          } else {
            vm.message = "Incorrect username, contact your Administrator.";
          }
        });
        //
      }
    };
});
