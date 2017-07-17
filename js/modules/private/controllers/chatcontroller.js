define(['app','ngload!chat-directive', 'ngload!chat-service'], function (app) {
    app.register.controller('ChatController', ['$rootScope', '$scope', '$window', 'SetFriendOperation', 'SetChatOperation', 'CreateSmileys', function ($rootScope, $scope, $window, SetFriendOperation, SetChatOperation, CreateSmileys)
	{
		var socket = undefined;
		$scope.userId = undefined;
		var reqIDArr = [];
		$scope.chatBuddyList = [];
		$scope.chatWindowList = [];
		$scope.chatWindowTracker = [];
		var generalDataSet = localStorage.getItem("generalDataSet")
		$scope.callAccepted = false;
		//Initialising socket connections for Chat App
		initializeSocket();
		angular.element(document).ready(function() {
			//initializeSocket();
		});

		$rootScope.$on("ON_LOGOUT", function(data){
			closeSocket();
		});

		//Listen for the event after easy rtc id created
		window.addEventListener("ON_EASYRTC_ID_CREATED", function(evt) {
			var videoObj = {};
			videoObj.senderVideoInfo = $rootScope.generalDataSet;
			videoObj.receiverVideoInfo = evt.detail;
			try{
				if($scope.callAccepted){
				//socket.emit('ON_ACCEPT_VIDEO_CHAT_REQUEST', videoObj);
					performCall($scope.receiedVideoObj.receiverVideoInfo.easyrtcid);
				}else{
					socket.emit('ON_SEND_VIDEO_CHAT_REQUEST', videoObj);
				}	
			}catch(err){
				console.log("Video Chat Error"+err);
			}
		}, false);
		function initializeSocket(){
			openSocket();
		}
		function closeSocket(){
			socket.disconnect();
			//$rootScope.switchSocket = true;
		}
		function openSocket()
		{
			$scope.userId = JSON.parse(generalDataSet)._id;
			var obj = {};
			//require(['socket-io'], function(io) {
				obj._id = $scope.userId;
				socket = io('http://localhost:3000/');
				//socket = io('https://de8a3aa6.ngrok.io/');
				//socket = io('http://192.168.17.208:3000/');
				socket.emit('ON_SOCKET_INIT', obj);
				socket.on("UPDATE_CHAT_LIST", function(data){
					//alert('update chat list');
					updateChatList();
				});

				//Getting the new msg from server
				socket.on('ON_NEW_MSG', function(data){
					openChatWindowOnNewMessage(data);
				});

			//});
		}

		var updateBuddyList = function(){
			//$(".scroller-arrow").css("display", "none");
			SetChatOperation.getChatBuddyList({"userid" : $scope.userId})
			.success(function(data){
				for(var count in data){
					if(data[count].userid == $scope.userId){
						reqIDArr.push(data[count].friendid);
					}else{
						reqIDArr.push(data[count].userid);
					}
				}
				//$rootScope.$emit("GET_FRIENDS_IDS", reqIDArr);
				SetFriendOperation.getAllConfirmedFriendsDetails({"reqidarr" : reqIDArr})
				.success(function(data){
					//$scope.chatBuddyList = data;
					updateChatList();
				});
			});
		}
		
		updateBuddyList();

		function updateChatList(){
			SetFriendOperation.getAllOnLineFriendsDetails({"reqidarr" : reqIDArr})
			.success(function(data){
				$scope.chatBuddyList = data;
			});
		}

		$scope.openChatWindow = function(obj){
			var i = $scope.chatWindowTracker.indexOf(obj._id);
			if(i === -1)
			{
				$scope.chatWindowTracker.push(obj._id);
				$scope.chatWindowList.push(obj);
			}
			
		}
		$scope.closeChatWindow = function(obj){
			//alert(obj._id);	
			disconnect();//Disconnecting Video Stream Explicitly
			var i = $scope.chatWindowTracker.indexOf(obj._id);
			if(i !== -1)
			{
				$scope.chatWindowTracker.splice(i,1);
				$scope.chatWindowList.splice(i,1);
			}
		}
		function openChatWindowOnNewMessage(obj){
			var trackerId = JSON.parse(obj.senderInfo)._id;
			var i = $scope.chatWindowTracker.indexOf(trackerId);
			if(i === -1 && trackerId !== JSON.parse(generalDataSet)._id)
			{
				$scope.chatWindowTracker.push(trackerId);
				$scope.chatWindowList.push(JSON.parse(obj.senderInfo));
				$scope.$apply();
				$rootScope.$on('ON_CHAT_WINDOW_READY', function(event, dataObj) {
					displayServerMsg(obj);
				});
			}else{
				displayServerMsg(obj);
			}

			
		}
		$scope.sendMessage = function(event){
			var msgObj = {};
			msgObj.msg = $(event.target).val();
			msgObj.senderInfo = generalDataSet;
			if(msgObj.msg !== ''){
				msgObj.receiverInfo = JSON.parse($(event.target).attr("data"));
				socket.emit('ON_SEND_MSG', msgObj);
				$(event.target).val("");
				displayClientMsg(msgObj);
			}

		}
		function displayServerMsg(obj){
			var receiverInfo = JSON.parse(obj.senderInfo);
	    	//var html = "<div class='msg row-fluid'><strong>" + obj.senderInfo.fullname + ":</strong> " + obj.msg+"</div>";
			var html = "<div class='row no-margin msg-row'><div class='msg pull-left col-md-2 no-padding'><img class='profile-pic-icon pull-left' src='"+receiverInfo.profilepic.imageBuffer+"'></div><div style='word-break: break-all; padding-top: 2px;' class='pull-left col-md-10 no-padding text-left msg-field'>"+CreateSmileys.setSmileys(obj.msg)+"</div></div>";
			//var html = "<div class='row no-margin msg-row'><div class='msg pull-rihgt col-md-2'><img class='profile-pic-icon' src=''></div><div style='word-break: break-all; padding-top: 2px;' class='pull-left col-md-10'>"+CreateSmileys.setSmileys(obj.msg)+"</div></div>";

			var validID = "";
			/*if(senderInfo.username != undefined){
				validID = senderInfo.username;
			}*/
			
			if(receiverInfo._id != undefined){
				validID = receiverInfo._id;
			}
			try{
				$("chat-window").find("#"+validID).find('.chat-panel-body').append(html);
				scrollToBottom($("chat-window").find("#"+validID).find('.chat-panel-body'), $("chat-window").find("#"+validID).find('.chat-panel-body').scrollHeight);
				//$(".chat-body-height").mCustomScrollbar();
			}
			catch(err){
				alert(err);
			}
	    }

		function displayClientMsg(obj){
	    	var html = "<div class='row no-margin msg-row'><div class='msg pull-right col-md-2 no-padding'><img class='profile-pic-icon pull-right' src='"+JSON.parse(obj.senderInfo).profilepic.imageBuffer+"'></div><div style='word-break: break-all; padding-top: 2px;' class='pull-right col-md-10 no-padding text-right msg-field'>"+CreateSmileys.setSmileys(obj.msg)+"</div></div>";
			//var html = "<div class='row no-margin msg-row'><div class='msg pull-left col-md-2'><img class='profile-pic-icon' src=''></div><div style='word-break: break-all; padding-top: 2px;' class='pull-left col-md-10'>"+CreateSmileys.setSmileys(obj.msg)+"</div></div>";

			var validID = "";
			
			if(obj.receiverInfo._id !== undefined){
				validID = obj.receiverInfo._id;
			}
			//$("chat-window").find("#"+validID).find('.chat-panel-body').empty();
	    	$("chat-window").find("#"+validID).find('.chat-panel-body').append(html);
	    	try{
	    		scrollToBottom($("chat-window").find("#"+validID).find('.chat-panel-body'), $("chat-window").find("#"+validID).find('.chat-panel-body').scrollHeight);
				//$(".chat-body-height").mCustomScrollbar();
	    	}catch(err){
	    		console.log(err);
	    	}
			
	    }

	    	//Smooth scroll to bottom of the div
		function scrollToBottom(obj, hight){
			var body = $(obj);
			body.animate({scrollTop: $(obj)[0].scrollHeight}, '100', 'swing', function() { 
			   //console.log("Finished animating");
			});
		}

			//Setting connection to easyrtc for Video Chat
		$scope.connectEasyRTCVideo = function(event){
			//connect(JSON.parse($(event.target).attr("data")));
			connect();
		}

		function openChatWindowOnNewVideoChatRequest(obj){
			var i = $scope.chatWindowTracker.indexOf(obj.senderVideoInfo._id);
			if(i === -1 && obj.senderVideoInfo._id != $rootScope.generalDataSet._id)
			{
				$scope.chatWindowTracker.push(obj.senderVideoInfo._id);
				$scope.chatWindowList.push(obj.senderVideoInfo);
			}
			$scope.$apply();
			displayVideoCall(obj);
		}


		$scope.onAcceptVideoCall = function(){
			$(".video-call-btn-group").hide();
			$scope.callAccepted = true;
			connect(null);
		}

		function displayVideoCall(obj){
			$("chat-window").find("#"+obj.senderVideoInfo._id).find(".video-call-btn-group").show();
			$scope.receiedVideoObj = obj;
    	}
		
	}]);
}); 