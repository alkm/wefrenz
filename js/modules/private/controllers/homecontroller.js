define(['app', 'ngload!userinfo-service', 'ngload!chat-controller', 'ngload!changeprofilepicmodal-controller', 'ngload!search-controller', 'ngload!search-service', 'ngload!utility-service', 'ngload!resource-filter', 'ngload!friend-service', 'ngload!notification-controller'], function (app) {
    app.register.controller('HomeController', ['$rootScope', '$scope', '$window', '$state', '$uibModal', 'FBInfoService', 'SetDimension', 'CheckLocalInfo', 'SetFriendOperation', function ($rootScope, $scope, $window, $state, $uibModal, FBInfoService, SetDimension, CheckLocalInfo, SetFriendOperation)
	{
		$rootScope.isNotificationShow = false;
		$rootScope.isFriendRequestPanelShow = false;
		$rootScope.notificationCount = 0;
		if(!CheckLocalInfo.checkGeneralDataSet()){
			$rootScope.$emit('ON_LOGOUT', { obj: "" });
		}
		var defaultProfilePic = "assets/images/defaultprofilepic.jpg";
		$scope.userid = undefined;
		if(localStorage && localStorage.getItem("generalDataSet")){
			try{
				var generalDataSet = localStorage.getItem("generalDataSet");
				$scope.name = JSON.parse(generalDataSet).fullname;
				$scope.userId = JSON.parse(generalDataSet)._id;
				var profilePic = JSON.parse(generalDataSet).profilepic.imageBuffer;
				$rootScope.profilePic = (profilePic === "") ? defaultProfilePic : profilePic;
				$rootScope.profilePicHeight = setDimension("height", JSON.parse(generalDataSet).profilepic.profilePicDimension);
				$rootScope.profilePicWidth = setDimension("width", JSON.parse(generalDataSet).profilepic.profilePicDimension);
				$rootScope.previewPicHeight = setDimension("height", JSON.parse(generalDataSet).profilepic.previewPicDimension);
				$rootScope.previewPicWidth = setDimension("width", JSON.parse(generalDataSet).profilepic.previewPicDimension);

			}catch(err){
				console.log(err);
			}
		}
		
		function setDimension(prop, val){
			return SetDimension.setImgDimension(prop, val);
		}
		
		$scope.onSignOutBtnClick = function(){
			localStorage.removeItem("generalDataSet");
			localStorage.clear();
			console.log(localStorage);
			$rootScope.$emit('ON_LOGOUT', { obj: "" });
		}
		
		$scope.onProfileClick = function(){
			$state.transitionTo("Profile",{profileid: $scope.userId});
		}
		$scope.onSearchRequest = function(){


        }
			/**
	 * Use a run block to ensure the modal will open from anywhere in the app.
	 **/
	  /**
	   * Listen to the `$stateChangeStart` event
	   */
	 // $rootScope.$on('$stateChangeStart', function (event, toState) {
		/**
		 * if the new state is not "terms", then ignore it
		 */
		//if(toState.name !== 'Home.changeProfilePic') return;
		/**
		 * Open the modal window
		 */
		 $scope.updateProfilePic = function(){
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/partials/private/modals/changeProfilePic.html',
				controller: 'ChangeProfilePicModalController',
				// controllerUrl: 'js/modules/private/controllers/modals/changeprofilepicmodalcontroller.js'
			});
			modalInstance.result.then(function () {
			  //alert('Modal success at:' + new Date());
			}, function () {
			 // alert('Modal dismissed at: ' + new Date());
			  $rootScope.$emit('ON_STOP_CAM_STREAM', { obj: "" });
			});

		  /*modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		  }, function() {
			$log.info('Modal dismissed at: ' + new Date());
		  });*/
		 }



		/**
		 * Prevent the transition to the dummy state, stay where you are
		 */
		// event.preventDefault();
	  // })

		
	}]);
	
}); 