var myApp = angular.module('myApp', ['ngMaterial', 'ngMessages', 'ngRoute', 'xeditable', 'md.data.table']);


myApp.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
/// ANGULAR MATERIAL THEME ///
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue', {
      'default' : '600',
      'hue-1' : '700',
      'hue-2' : '900'
    })
    .accentPalette('green',{
      'default': '300'
    })
    .warnPalette('purple', {
      'default': '600'
    })
    .backgroundPalette('grey', {
      'default' : '100',
      'hue-1' : '500'
    });

/// ROUTES ///
  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/userhome', {
      templateUrl: '/views/templates/userhome.html',
      controller: 'HomeController as hc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/goal', {
      templateUrl: '/views/templates/addGoal.html',
      controller: 'GoalController as gc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/editGoal', {
      templateUrl: '/views/templates/editGoal.html',
      controller: 'GoalController as gc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/tracking', {
      templateUrl: '/views/templates/tracking.html',
      controller: 'TrackingController as tc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/staff', {
      templateUrl: '/views/templates/staff.html',
      controller: 'StaffController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/jobSites', {
      templateUrl: '/views/templates/jobSites.html',
      controller: 'JobSitesController as jc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/viewGoal', {
      templateUrl: '/views/partials/goalView.html',
      controller: 'GoalController as gc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/clients', {
      templateUrl: '/views/templates/clients.html',
      controller: 'ClientController as cc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    // .when('/userhome', {
    //   templateUrl: '/views/partials/admin.html',
    //   resolve: {
    //     getuser : function(UserService){
    //       return UserService.getuser();
    //     }
    //   }

    .otherwise({
      redirectTo: 'home'
    });
});
