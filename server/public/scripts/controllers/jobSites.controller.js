myApp.controller('JobSitesController', function(UserService, $http) {
  console.log('JobSitesController created');
  //jsc = JobSitesController
  var jsc = this;
  jsc.userService = UserService;
  jsc.userObject = UserService.userObject;
  jsc.manageJobSiteData = [];

  getManageJobSites();

//GET all Jobsites in the DB and display on the DOM
  function getManageJobSites(){
    $http.get('/jobSites/managejobsites').then(function(response) {
      jsc.manageJobSiteData = response.data;
      console.log('Getting all the jobsites: ', response.data);
    }); //end of $http.get for managejobsites
  } //end of getManageJobSites

// PUT request to update Jobsites
  function updateJobSites(id){
    $http.put('/jobSites/editjobsites/' + id, data).then(function(response) {
      console.log('JobSites Updated: ', response);
    }); //end of $http.put for updateJobSites
  } //end of updateJobSites


//Add a new jobsite to the DB
function addNewJobSite() {
  $http.post('/jobSites/newjobsite/').then(function(response) {
    console.log('added new Job Site to db:', response);
  });
}

//Disable JobSite
  jsc.disableJobSite = function(id) {
        console.log('jobSite id to disable: ', id);
        $http.put('/jobSites/disablejobsite/' + id, data).then(function(response){
          console.log('Disable jobSites response: ', response);
        });
      }; //end of disableJobSites



}); //end of JobSitesController
