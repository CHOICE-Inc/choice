var myApp = angular.module('myApp', ['ngRoute']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
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
    .when('/summary', {
      templateUrl: '/views/templates/summary.html',
      controller: 'SummaryController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/goal', {
      templateUrl: '/views/templates/goal.html',
      controller: 'CriteriaController as cc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/tracker', {
      templateUrl: '/views/templates/tracker.html',
      controller: 'TrackingController as tc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/staff', {
      templateUrl: '/views/templates/staff.html',
      controller: 'StaffController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/jobSites', {
      templateUrl: '/views/templates/jobSites.html',
      controller: 'JobSitesController as jc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })

    .otherwise({
      redirectTo: 'home'
    });
});
