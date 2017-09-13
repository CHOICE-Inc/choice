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
/**
* @api {get} /jobsites/managejobsites Retrieve ALL jobsite names and IDs
* @apiName GetAllJobsites
* @apiGroup RetrieveData
*
* @apiSuccess {String} address Jobsite's address
* @apiSuccess {String} business_name Jobsites's name
* @apiSuccess {String} contact Jobsite contact name
* @apiSuccess {Boolean} editing Boolean variable to determine edit status
* @apiSuccess {Number} id Jobsite ID
* @apiSuccess {Number} jobsite_id Jobsite's ID
* @apiSuccess {Boolean} jobsite_status Indicates active job site
* @apiSuccess {String} phone Phone number for job site
* @apiSuccess {String} status Label for edit button "Deactive" / "Activate"
*/
  function getManageJobSites(){
    $http.get('/jobSites/managejobsites').then(function(response) {
      console.log('Getting all the jobsites: ', response.data);
//FOR LOOP TO LOOP THROUGH DATA TO CHECK BOOLEAN FOR jobsite_status IN THE JOBSITE TABLE
      for(i=0;i<response.data.length; i++){ //add a new object property based on the status for each jobsite
        response.data[i].editing = false;
        if(response.data[i].jobsite_status === true){
          response.data[i].status = "Deactivate";
        }
        else if (response.data[i].jobsite_status === false){
          response.data[i].status = "Activate";
        }
      }
      jsc.manageJobSiteData = response.data;
      console.log("manageJobSiteData: ", jsc.manageJobSiteData);
    }); //end of $http.get for managejobsites
  } //end of getManageJobSites


// --------POST ROUTES------------

//ADD NEW JOBSITE TO THE DB
/**
* @api {post} /jobsites/newjobsite Add a new jobsite to the database
* @apiName PostJobsite
* @apiGroup AddData
*
* @apiParam {String} address Jobsite's address
* @apiParam {String} business_name Jobsites's name
* @apiParam {String} contact Jobsite contact name
* @apiParam {Boolean} jobsite_status Indicates active job site
* @apiParam {String} phone Phone number for job site
* @apiParam {String} status Label for edit button "Deactive" / "Activate"
*/
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
/**
* @api {put} /jobsites/disablejobsite Disable a jobsite
* @apiName DisableJobsite
* @apiGroup UpdateData
*
* @apiParam {Number} id Jobsite's unique id
* @apiParam {Boolean} jobsite_status Indicates job site's active status
*/
//Disable JobSite by toggleing jobsite's status
  jsc.disableJobSite = function(id, boolean) {
        console.log('jobSite id to disable: ', id);
        console.log('boolean value: ', boolean);
        $http.put('/jobSites/disablejobsite/' + id + '/' + boolean).then(function(response){
          console.log('Disable jobSites response: ', response);
          getManageJobSites();
        });
      }; //end of disableJobSites

      // Toggles the display of editable content, and assigns the staffmember to be edited
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
