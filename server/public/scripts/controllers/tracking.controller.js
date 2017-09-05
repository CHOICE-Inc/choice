myApp.controller('TrackingController', function(UserService, $http, $mdToast) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.dataList = [];
  vm.clientList = [];
  vm.locationList = [];
  vm.caseManagers = [];
  vm.clientGoals = [];
  vm.clientToView = {};
  vm.trackingData = {};
  vm.initials = "";
  vm.today = new Date();
  vm.filters = ['Show All', 'Location', 'Case Manager', 'Option 3', 'Option 4', 'Option 5'];
  vm.hidden=false;
  vm.rowClass = 'rowDefault';

  // builds list of clients to display on goal tracking page
  buildLists = function(data){
    console.log('in buildClientList with:', data);
    var names = [];
    var locations = [];
    var cms = [];
    for(var i = 0; i < data.length; i++){
      if(!names.includes(data[i].client_name)){
        vm.clientList.push(data[i]);
        names.push(data[i].client_name);
      }
      if(!locations.includes(data[i].business_name)){
        vm.locationList.push(data[i].business_name);
        locations.push(data[i].business_name);
      }
      if(!cms.includes(data[i].staff_name)){
        vm.caseManagers.push(data[i].staff_name);
        cms.push(data[i].staff_name);
      }
    }
  };

  getLastUpdate = function(goal){
    console.log('in getLastUpdate with:', goal);
    var today = new Date();
    var date = today.getFullYear() + "-" + getMonth(today.getMonth(), "month") + "-" + getMonth(today.getDate(), "day");
    var amDate = goal.max_goal_date_am.toString().substring(0, 10);
    var pmDate = goal.max_goal_date_pm.toString().substring(0, 10);
    // console.log('STRING date is:', date);
    // console.log('STRING amdate is:', amDate);
    // console.log('STRING pmdate is:', pmDate);
    if(date == amDate){
      goal.amDone = true;
    }
    if(date == pmDate){
      goal.pmDone = true;
    }
    // console.log('goal.amDone is:',goal.amDone);
    // console.log('goal.pmDone is:',goal.pmDone);

    if(goal.max_goal_date_am > goal.max_goal_date_pm){
      return goal.max_goal_date_am;
    } else {
      return goal.max_goal_date_pm;
    }
  }; //end of getLastUpdate

  //ted stuff
  getClients();

  // gets list of clients
  function getClients(){
    $http.get('/tracking/getClients').then(function(response) {
      console.log(response.data);
      vm.dataList = response.data;
      buildLists(vm.dataList);
      // console.log('vm.clientList:',vm.clientList);
      // console.log('vm.locationList:',vm.locationList);
      // console.log('vm.caseManagers:',vm.caseManagers);
    });
  }
  //end ted stuff

  // gets client goals
  vm.showClientGoals = function(client){
    console.log('in showClientGoals with client:', client);
    vm.clientToView = client;
    $http.get('/tracking/getGoals/' + client.clientid).then(function(response) {
      console.log('getGoals response:',response.data);
      vm.clientGoals = response.data;
      for(var i = 0; i < vm.clientGoals.length; i++){
        vm.clientGoals[i].lastUpdate = getLastUpdate(vm.clientGoals[i]);
      }

    });
  };

  // filters client list based on filter options
  vm.filterClients = function(data){
    var tempList = angular.copy(data);

    // console.log('in filterClients with data:', data);
    // console.log('in filterClients with CM:', vm.filterCm);
    // console.log('in filterClients with JS:', vm.filterJs);

    if(vm.caseManagers.includes(vm.filterCm)){
      for(var i = 0; i < tempList.length; i++){
        if(tempList[i].staff_name != vm.filterCm){
          tempList.splice(i,1);
          i--;
        }
      }
    }
    if(vm.locationList.includes(vm.filterJs)){
      for(var p = 0; p < tempList.length; p++){
        if(tempList[p].business_name != vm.filterJs){
          tempList.splice(p,1);
          p--;
        }
      }
    }
    console.log('tempList is:',tempList);
    console.log('data is:', data);
    var names = [];
    vm.clientList = [];
    for(var x = 0; x < tempList.length; x++){
      if(!names.includes(tempList[x].client_name)){
        vm.clientList.push(tempList[x]);
        names.push(tempList[x].client_name);
      }
    }
  }; // end filterClients


  // submits goal tracking data
  vm.trackGoal = function(goal){

    console.log('in trackGoal');
    var goalData = {
      id: goal.goalid,
      time: goal.amOrPm,
      completion: goal.completion,
      notes: goal.notes,
      initials: vm.initials,
      date: new Date(),
    };
    console.log('sending goalData:', goalData);

    if(goalData.time == undefined){
      console.log('error: fill in time');
      swal(
        'Oops...',
        'Please select either <b>AM</b> or <b>PM</b>.',
        'error'
      );
    } else if(goalData.completion == undefined){
      console.log('error: fill in completion');
      swal(
        'Oops...',
        'Please select a <b>completion status</b>.',
        'error'
      );
    } else if(goalData.time == "am" && goal.amDone == true){
      console.log('am already done');
      swal(
        'Today\'s AM data has already been tracked.',
        'To modify an entry, please click the <span style="color:blue"><b>Goal History</b></span> button.',
        'error'
      );
    } else if(goalData.time == "pm" && goal.pmDone == true){
      console.log('pm already done');
      swal(
        'Today\'s PM data has already been tracked.',
        'To modify an entry, please click the <span style="color:blue"><b>Goal History</b></span> button.',
        'error'
      );
    } else if(vm.initials == ""){
      console.log('no initials');
      swal(
        'Please initial this tracking entry.',
        'Enter your initials in the field labeled "initials."',
        'error'
      );
    } else {
      $http.post('/tracking/trackGoal/', goalData).then(function(response){
        console.log('Received response from trackGoal POST:', response);
        vm.showClientGoals(vm.clientToView);
        vm.showToast("Goal data submitted.", "footer");
      });
    }
  }; //end of trackGoal

  vm.toGoalCriteria = function(goal){
    console.log('in toGoalCriteria with goal:', goal);
  };

  vm.toGoalHistory = function(goal){
    // console.log('in toGoalHistory with goal:', goal);
    // console.log('goal hidden is:', goal.hidden);
    if(goal.hidden == undefined){
      goal.hidden = true;
      vm.getGoalHistory(goal);
    } else if(goal.hidden == false){
      vm.getGoalHistory(goal);
      goal.hidden = !goal.hidden;
    } else {
      goal.hidden = !goal.hidden;
    }
  };

  vm.showToast = function(message, parentId){
    var el = angular.element(document.getElementById(parentId));

    var toast = $mdToast.simple()
    .content(message)
    .highlightAction(true)
    .hideDelay(1500)
    .position('bottom left')
    .parent(el);

    $mdToast.show(toast);
  };

  vm.filterHistory = function(goal){
    // console.log('in filterHistory with id:', id);
    // console.log('in filterHistory with startDate:', vm.historyStart);
    // console.log('in filterHistory with endDate:', vm.historyEnd);

    goal.shownHistory = angular.copy(goal.history);
    if(goal.historyStart == undefined){
      console.log('error: fill in start date');
      swal(
        'Oops...',
        'Please enter a <b>start date<b>.',
        'error'
      );
    } else if(goal.historyEnd == undefined){
      console.log('error: fill in end date');
      swal(
        'Oops...',
        'Please enter an <b>end date<b>.',
        'error'
      );
    } else if(goal.historyStart > goal.historyEnd) {
      swal(
        'Oops...',
        'The start date cannot be a later date than the end date.',
        'error'
      );
    } else {
      var newHistory = [];

      for(var i = 0; i < goal.history.length; i++){
        console.log('type of date_tracked', typeof goal.history[i].date_tracked);
        if(typeof goal.history[i].date_tracked == "string"){
          console.log('is string, converting');
          goal.history[i].date_tracked = new Date(goal.history[i].date_tracked);
          console.log('goal.history[i].date_tracked is:',goal.history[i].date_tracked);
          console.log('typeof goal.history[i].date_tracked is:',typeof goal.history[i].date_tracked);
        }

        if(!(goal.history[i].date_tracked < goal.historyStart || goal.history[i].date_tracked > goal.historyEnd)){
          newHistory.push(goal.history[i]);
        }
      }
      console.log('newHistory:', newHistory);
      goal.shownHistory = newHistory;
      console.log('new goal.shownHistory is:', goal.shownHistory);
    }

  }; //end of filterHistory

  getMonth = function(num, monthOrDay){
    if(monthOrDay == "month"){num += 1;}
    if(num < 10){return "0" + num;}
    else {return num;}
  };


  vm.getGoalHistory = function(goal){
    console.log('in getGoalHistory');
    $http.get('/tracking/getGoalHistory/' + goal.goalid).then(function(response) {
      console.log('getGoalHistory response:',response.data);
      goal.history = response.data;
      goal.shownHistory = response.data;
      console.log('goal.history is:', goal.history);

    });
  };


  vm.test = function(){
    console.log('in test');
    var x = 3;
    console.log('am is:' ,vm.clientGoals[0].max_goal_date_am);
    console.log('pm is:' ,vm.clientGoals[0].max_goal_date_pm);
    console.log(vm.clientGoals[0].max_goal_date_pm < vm.clientGoals[0].max_goal_date_am);
    console.log('getTime is:', vm.clientGoals[0].max_goal_date_pm);
  };

  vm.convertDate = function(date){
    console.log('in convertDate with date:', date);
    var d = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
    console.log('d is:', d);
  };

  //Change class on goal history table depending on goal completion
  function setTableRowClass(completionStatus){
    if(completionStatus === 'complete'){
      vm.rowClass = 'rowComplete';
    } else if(completionStatus === 'incomplete'){
      vm.rowClass = 'rowIncomplete';
    } else {
      vm.rowClass = 'rowDefault';
    }
  } //end function

}); //END OF CONTROLLER
