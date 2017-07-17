define(['app', 'ngload!chat-controller', 'ngload!search-controller', 'ngload!search-service', 'ngload!utility-service', 'ngload!drag-bg', 'ngload!friend-service', 'ngload!notification-controller'], function (app, $location) {
    var generalDataSet = JSON.parse(localStorage.getItem("generalDataSet"));
   /* if(generalDataSet){

    }else{
    	$location.path();
    }*/
    app.register.controller('ProfileController', ['$rootScope', '$scope', '$window', '$state','$stateParams', 'ProfileInfoService', 'SetDimension', 'SetPicsOperation', 'SetFriendOperation', function ($rootScope, $scope, $window, $state, $stateParams, ProfileInfoService, SetDimension, SetPicsOperation, SetFriendOperation)
	{
		/*if(!CheckLocalInfo.checkGeneralDataSet()){
			$rootScope.$emit('ON_LOGOUT', { obj: "" });
		}*/
		$scope.isProfileBtnShow = false;
		$scope.wallPicPath = "../images/defaultimages/wallpic/defaultwallpic.jpg";
		$scope.otherProfilePic = undefined;
		$scope.otherProfilePicHeight = undefined;
		$scope.otherProfilePicWidth = undefined;
		$scope.profileId = $stateParams.profileid;
		$scope.userId = undefined;
		$scope.friendInfo = {};
		$scope.wallPicInfo = {};
		var defaultProfilePic = "../images/defaultimages/profileimages/defaultprofilepic.jpg";


		$(".wall-pic").css("background", "url('"+$scope.wallPicPath+"')");
		$('.wall-pic').backgroundDraggable({ bound: true });
		
		var profileInfo = {};
		profileInfo.profileid = $scope.profileId;
		angular.element(document).ready(function () {
			
			if($scope.profileId === undefined){
				
			}
	        ProfileInfoService.get({"profileinfo": profileInfo})
			.success(function(data) {
				//$scope.loading = false;
				var profilePic = data.profilepic;
				$scope.otherProfilePic = (profilePic === undefined) ? defaultProfilePic : profilePic;
				$scope.otherProfilePicHeight = setDimension("height", profilePic.profilePicDimension);
				$scope.otherProfilePicWidth = setDimension("width", profilePic.profilePicDimension);

			});
    	});
    	if(generalDataSet){
    		$scope.userId = generalDataSet._id;
    	}
    	if($scope.userId !== $scope.profileId){
    		$scope.friendInfo.userId = $scope.userId;
			$scope.friendInfo.friendId = $scope.profileId;
	    	SetFriendOperation.getFriendInfo({"friendInfo" : $scope.friendInfo})
			.success(function(data){
				$scope.isProfileBtnShow = true;
				if((data.status == "pending" || data.status == "displayed") && data.agent == "requester"){
					$("#addFriendBtn").css("display", "none");
					$("#confirmedFriendBtn").css("display", "none");
					$("#respondFriendBtn").css("display", "none");
					$("#pendingFriendBtn").css("display", "block");
				}
				if((data.status == "pending" || data.status == "displayed") && data.agent == "responder"){
					$("#addFriendBtn").css("display", "none");
					$("#confirmedFriendBtn").css("display", "none");
					$("#respondFriendBtn").css("display", "block");
					$("#pendingFriendBtn").css("display", "none");
				}
				if(data.status == "!friend" && data.agent == "none"){
					$("#addFriendBtn").css("display", "block");
					$("#confirmedFriendBtn").css("display", "none");
					$("#respondFriendBtn").css("display", "none");
					$("#pendingFriendBtn").css("display", "none");
				}
				if(data.status == "confirmed"){
					$("#addFriendBtn").css("display", "none");
					$("#confirmedFriendBtn").css("display", "block");
					$("#respondFriendBtn").css("display", "none");
					$("#pendingFriendBtn").css("display", "none");
				}
				else{
				
				}
				
			});
    	}else{
    		
    	}


		$scope.onAddBtnClick = function(obj){
			//alert(obj.currentTarget.attributes.data.nodeValue);
			SetFriendOperation.setFriendInfo({"friendInfo" : $scope.friendInfo})
			.success(function(data){
				if(data == "sent"){
					$("#addFriendBtn").css("display", "none");
					$("#pendingFriendBtn").css("display", "block");
				}
			});
		}

		function setDimension(prop, val){
			return SetDimension.setImgDimension(prop, val);
		}

		$window.saveWallPicPos = function(){
			$scope.wallPicInfo.profileid = $scope.profileId;
			$scope.wallPicInfo.wallpicpos = $('.wall-pic').css("background-position");
			SetPicsOperation.saveWallPicPos($scope.wallPicInfo);
		}
		
	}]);
	
}); 