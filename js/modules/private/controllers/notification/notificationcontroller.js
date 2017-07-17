'use strict';
define(['app'], function (app) {
	/* Controllers */
	app.register.controller('NotificationController', ['$scope', '$rootScope', '$location', 'SetFriendOperation', 'CheckLocalInfo', function($scope, $rootScope, $location, SetFriendOperation, CheckLocalInfo) {
		$scope.userId = undefined;
		$scope.isNotificationClicked = false;
		$scope.reqCountBtnDisabled = true;
		$scope.requestInfoArr = [];
		if(localStorage && localStorage.getItem("generalDataSet")){
			var generalDataSet = localStorage.getItem("generalDataSet")
			$scope.userId = JSON.parse(generalDataSet)._id;
		}

		//Getting friend Request who ever have added you as a friend and most important only those requests which are new, not those which you already viewed.
		SetFriendOperation.getFriendReq({"userid" : $scope.userId})
			.success(function(data){
				buildFriendReqUI(data);
		});
		$scope.requestIDArr = [];
		function buildFriendReqUI(data){
			if(data.length >= 1){
				$rootScope.isNotificationShow = true;
				$rootScope.notificationCount = data.length;
				//$(".notification-count").html();
				for(var count in data){
					$scope.requestIDArr.push(data[count].userid);
				}
			}
		}
		$scope.getFriendReqDetails= function(event){
			$rootScope.$broadcast('onReqBtnClicked', "");
			$(".friend-req-count").empty();
		}
		$scope.getAllFriendReqDetails= function(event){
			//$(".friend-req-list-container").toggle();
			//$rootScope.$broadcast('onAllReqBtnClicked', "");
			//Get all the friend request both earlier seen & anything if new
			SetFriendOperation.getAllFriendReq({"userid" : $scope.userId})
				.success(function(data){
					console.log("This much Req"+data);
					buildFriendReqUI(data);
					//$(".friend-req-count").empty();
					getRequestDetails($scope.requestIDArr);
					$scope.requestIDArr = [];
			});
			$rootScope.isNotificationShow = false;
			
		}

		//Get all the friend request details which are not shown before
		function getRequestDetails(reqArr){
			if(!$scope.isNotificationClicked){
				SetFriendOperation.getRequestDetails({"reqarr" : reqArr})
				.success(function(data){
					console.log("This much Req Data"+data);
					for ( var count in data){
						$scope.requestInfoArr.push(data[count]);
					}
					$rootScope.isFriendRequestPanelShow = true;
					$scope.isNotificationClicked = true;
				});	
			}
		}
		
		$rootScope.$on('onGetReqInfo', function(event, params) {
			$scope.requestInfoArr = [];
			$scope.requestInfoObj = params;
			$scope.reqCountBtnDisabled = false;
			for ( var count in params){
				$scope.requestInfoArr.push(params[count]);
			}
			$(".friend-req-list-container").css("display", "block");
		});
		
		//Hiding the friend request panel clicking outside
		$("html").click(function(e){
			if(e.target.class != "friend-req-list-container" && e.target.class != "friendReqNotificationImg")
			{
				//$(".friend-req-list-container").css("display", "none");
				$rootScope.isFriendRequestPanelShow = false;
			}
		});
		$(document).mouseup(function (e)
		{

		    var container = $(".friend-req-list-container");
		    var btn = $(".fa-bell");

		   /* if (!container.is(e.target) // if the target of the click isn't the container...
		        && container.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		        container.hide();
		    }

		    if(!btn.is(e.target) && btn.has(e.target).length === 0){
		    	container.hide();
		    }*/
		});
		
		$scope.onConfirmFriendBtnClick = function(event){
			var reqInfo = {};
			//reqInfo.userId = $scope.uid;
			reqInfo.userId = $scope.userId;
			reqInfo.friendId = event.target.id;
			
			SetFriendOperation.confirmFriendReq({"reqinfo" : reqInfo})
				.success(function(data){
					alert("friend confirmed");
			});
		}

	}]);
});

