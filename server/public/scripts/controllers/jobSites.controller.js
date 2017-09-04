myApp.controller('JobSitesController', function(UserService, $http) {
  console.log('JobSitesController created');
  //jsc = JobSitesController
  var jsc = this;
  jsc.userService = UserService;
  jsc.userObject = UserService.userObject;
  jsc.manageJobSiteData = [];

  getManageJobSites();

  function getManageJobSites(){
    $http.get('/jobSites/managejobsites').then(function(response) {
      jsc.manageJobSiteData = response.data;
      console.log('Getting all the jobsites: ', response.data);
    }); //end of $http.get for managejobsites
  } //end of getManageJobSites


}); //end of JobSitesController
