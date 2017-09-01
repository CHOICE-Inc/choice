myApp.factory('UserService', function($http, $location, $mdDialog){
  console.log('UserService Loaded');

  var userObject = {};

  return {
    userObject : userObject,

    getuser : function(){
      console.log('UserService -- getuser', userObject);
      $http.get('/user').then(function(response) {
          if(response.data.username) {
              // user has a curret session on the server
              console.log(response.data);
              userObject.userName = response.data.username;
              console.log('UserService -- getuser -- User Data: ', userObject.userName);
          } else {
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      },function(response){
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout : function() {
      console.log('UserService -- logout');
      $http.get('/user/logout').then(function(response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    },

    //OPEN MENU FUNCTIONALITY NEEDED FOR NAV BAR
    openMenu : function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    },

    //Open Goal in Goal.html for editing
    openGoal : function(goal, $event) {
      console.log("Going to open ", goal, " for editing.");
    },

    //Show "Recipe Saved" Notification
    showSaveNotification : function(ev, type){
      var alert = $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .title(type + ' saved!')
            .textContent('You have saved some data.')
            .ok('Got it!')
            .targetEvent(ev);

      $mdDialog.show(alert).then(function(){
          $location.path('/summary');
        });
    }


  }; //end of return
}); //end of factory
