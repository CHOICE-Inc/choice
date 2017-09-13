myApp.controller('JobSitesController', function($http, $mdToast, $location, UserService, GoalService) {
  console.log('JobSitesController created');
  //jsc = JobSitesController
  var jsc = this;
  jsc.userService = UserService;
  jsc.userObject = UserService.userObject;
  jsc.goalService = GoalService;
  jsc.manageJobSiteData = [];
  jsc.editStatus = false;
  var jobsiteObject = {};
  var jobsiteData = {};

  getManageJobSites();


// ----------GET ROUTES------------

//GET all Jobsites in the DB and display on the DOM
  function getManageJobSites(){
    $http.get('/jobSites/managejobsites').then(function(response) {
      console.log('Getting all the jobsites: ', response.data);
//FOR LOOP TO LOOP THROUGH DATA TO CHECK BOOLEAN FOR jobsite_status IN THE JOBSITE TABLE
      for(i=0;i<response.data.length; i++){ //add a new object property based on the status for each jobsite
        response.data[i].editing = false;
        if(response.data[i].jobsite_status === true){
          response.data[i].status = "Active";
        }
        else if (response.data[i].jobsite_status === false){
          response.data[i].status = "Inactive";
        }
      }
      jsc.manageJobSiteData = response.data;
      console.log("manageJobSiteData: ", jsc.manageJobSiteData);
    }); //end of $http.get for managejobsites
  } //end of getManageJobSites


// --------POST ROUTES------------

//ADD NEW JOBSITE TO THE DB
 jsc.addNewJobSite = function(business_name, address, phone, contact, jobsite_status) {
   jobsiteObject.business_name = business_name;
   jobsiteObject.address = address;
   jobsiteObject.phone = phone;
   jobsiteObject.contact = contact;
   jobsiteObject.jobsite_status = jobsite_status;

  $http.post('/jobSites/newjobsite', jobsiteObject).then(function(response) {
    console.log('added new Job Site to db:', response);
    swal(
'Success!',
'A new job site has been added.',
'success'
);
    getManageJobSites();
    if (response) {
      console.log('server sent something back: ', response);
    }
  }).catch(function(){
    swal(
'Error adding new job site.',
'Make sure all required information has been entered!',
'error'
);
  });

};

// ----------PUT ROUTES----------



//PUT request to Disable JobSite
  jsc.disableJobSite = function(id, boolean) {
        console.log('jobSite id to disable: ', id);
        console.log('boolean value: ', boolean);
        $http.put('/jobSites/disablejobsite/' + id + '/' + boolean).then(function(response){
          console.log('Disable jobSites response: ', response);
          getManageJobSites();
        });
      }; //end of disableJobSites

      // Toggles the display of editable content, and assigns the jobsite to be edited
      jsc.toggleEditing = function(jobsite){
        console.log('in toggleEditing with jobsite:', jobsite);
        jsc.siteToEdit = jobsite;
        jobsite.editing = !jobsite.editing;
        jsc.editStatus = !jsc.editStatus;
        console.log('ending toggleEditing with jobsite:', jobsite);
      };

      jsc.updateJobSite = function(jobsite){
        console.log('in updateJobSite, sending:', jobsite);
        $http.put('/jobSites/editjobsites/', jobsite).then(function(response){
          swal(
    'Success!',
    'Job site information has been updated.',
    'success'
    );
          console.log(response.data);
          getManageJobSites();
        }).catch(function(){
          swal(
      'Error updating job site.',
      'Make sure all required information has been entered!',
      'error'
    );
        });
      };

}); //end of JobSitesController
