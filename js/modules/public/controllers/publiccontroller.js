define(['app', 'common/services/userinfoservice'], function (app) {
    app.register.controller('PublicController', ['$scope', '$window', function ($scope, $window)
	{

		
	}]);
	app.register.controller('SignUpController', ['$scope', '$window', 'SignUpInfoService', function ($scope, $window, SignUpInfoService)
	{
		var signUpInfo = {};
		
		// check to make sure the form is completely valid
		$scope.submitSignUpForm = function(isValid){
			if (isValid) {
				signUpInfo.fullName = $scope.fullName;
				signUpInfo.email = $scope.email;
				signUpInfo.password = $scope.password;
				SignUpInfoService.create({"signupinfo": signUpInfo})
					.success(function(data) {
					$scope.loading = false;
					if(data.status == "success"){
						alert(data.message);
						resetForm();
					}
					else{
						alert(data.message);
					}
				});
			}
		}
		function resetForm(){
			$scope.signUpForm.$setPristine();
			$scope.fullName = "";
			$scope.email = "";
			$scope.password = "";
		}
		
	}]);
	
	app.register.controller('LoginController', ['$scope', '$window', '$rootScope', 'LogInInfoService', 'FBInfoService', function ($scope, $window, $rootScope, LogInInfoService, FBInfoService)
	{
		$rootScope.generalDataSet = "";
		$rootScope.isLogin = false;
		if($rootScope.navSection == "private"){
			//$rootScope.$emit('ON_FB_LOGIN_SUCCESS', { obj: "" });
		}
		$(document).on("TEST_LOGIN_STATE", checkLoginState);
		 // This is called with the results from from FB.getLoginStatus().
		var logInInfo = {};
		$scope.submitLogInForm = function(){
			//if ($scope.signUpForm.$valid) {
				logInInfo.email = $scope.email;
				logInInfo.password = $scope.password;
				LogInInfoService.create({"logininfo": logInInfo})
				.success(function(data) {
					$scope.loading = false;
					if(data.status == "success"){
						var obj = {};
						obj.name = data.info.fullname;
						obj.email = data.info.username;
						if(data.info.profilepic == ""){
							var defaultProfilePic = {};
							defaultProfilePic.imageBuffer = "../images/defaultimages/profileimages/defaultprofilepic.jpg";
							defaultProfilePic.previewPicDimension = "100x100";
							defaultProfilePic.profilePicDimension = "75x75";
							obj.profilePic = defaultProfilePic;
						}else{
							obj.profilePic = data.info.profilepic;
						}
						
						obj.id = data.info._id;
						obj.userid = data.info.username;
						//$rootScope.generalDataSet = obj;
						$rootScope.generalDataSet = data.info;
						localStorage.setItem("generalDataSet", JSON.stringify($rootScope.generalDataSet));
						$rootScope.$emit('ON_LOGIN_SUCCESS', { obj: obj});
					}
					else{
						alert(data.message);
					}
				});
			//}
		}
		 
		 
		function statusChangeCallback(response) {
			console.log('statusChangeCallback');
			// The response object is returned with a status field that lets the
			// app know the current login status of the person.
			// Full docs on the response object can be found in the documentation
			// for FB.getLoginStatus().
			if(sessionStorage.isLogout == 1){
				return;
			}
			if (response.status === 'connected') {
			  // Logged into your app and Facebook.
				$rootScope.isLogin = true;
				basicAPIRequest();
			} else if (response.status === 'not_authorized') {
				$rootScope.isLogin = false;
			  // The person is logged into Facebook, but not your app.
			  //document.getElementById('status').innerHTML = 'Please log ' +
				'into this app.';
			} else {
				$rootScope.isLogin = false;
			  // The person is not logged into Facebook, so we're not sure if
			  // they are logged into this app or not.
			  /*document.getElementById('status').innerHTML = 'Please log ' +
				'into Facebook.';*/
			}
		}

		// This function is called when someone finishes with the Login
		// Button.  See the onlogin handler attached to it in the sample
		// code below.
		function checkLoginState() {
			FB.getLoginStatus(function(response) {
			  statusChangeCallback(response);
			});
		}
		$rootScope.$on('ON_LOGOUT', function(event, next) {
			sessionStorage.isLogout = 1;
        	fbLogoutUser();
		   //checkLoginState();
		});
		function fbLogoutUser() {
			if(typeof FB.logout == 'function'){
				if (FB.getAuthResponse()) {
				 FB.logout(function(response) { 
				 	document.location.reload();
				 }); 
				 return;
				}  
			};
			document.location.reload();
			return;  
		}
		
		//handle a session response from any of the auth related calls
		function handleSessionResponse(response) {
			//if we dont have a session (which means the user has been logged out, redirect the user)
			if (!response.session) {
				return;
			}

			//if we do have a non-null response.session, call FB.logout(),
			//the JS method will log the user out of Facebook and remove any authorization cookies
			FB.logout(response.authResponse);
		}
		

		window.fbAsyncInit = function() {
			FB.init({
			appId      : '1748046915427714',
			cookie     : true,  // enable cookies to allow the server to access 
								// the session
			xfbml      : true,  // parse social plugins on this page
			version    : 'v2.2' // use version 2.2
			});

			// Now that we've initialized the JavaScript SDK, we call 
			// FB.getLoginStatus().  This function gets the state of the
			// person visiting this page and can return one of three states to
			// the callback you provide.  They can be:
			//
			// 1. Logged into your app ('connected')
			// 2. Logged into Facebook, but not your app ('not_authorized')
			// 3. Not logged into Facebook and can't tell if they are logged into
			//    your app or not.
			//
			// These three cases are handled in the callback function.

			FB.getLoginStatus(function(response) {
				statusChangeCallback(response);
			});

		};

		// Load the SDK asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		// Here we run a very simple test of the Graph API after login is
		// successful.  See statusChangeCallback() for when this call is made.
		function basicAPIRequest(){
			FB.api('/me', 
				{fields: "id,about,age_range,picture,bio,birthday,context,email,first_name,gender,hometown,link,location,middle_name,name,timezone,website,work"}, 
				function(response) {
					//$scope.isEnableFBLogin = false; 
				  //$("#fb-profile-picture").append('<img src="' + response.picture.data.url + '"> ');
				  //$("#name").append(response.name);
				  //$("#user-id").append(response.id);
				  //$("#work").append(response.gender);
				  //$("#birthday").append(response.birthday);
				  //$("#education").append(response.hometown);
					$rootScope.menuSection = "active";
					$rootScope.searchBox = "active";
					$scope.name = response.name;
					$scope.email = response.email;
					var profilePic = {};
					profilePic.imageBuffer = response.picture.data.url;
					profilePic.previewPicDimension = "100x100";
					profilePic.profilePicDimension = "75x75";
					$rootScope.profilePic = (!profilePic.imageBuffer) ? defaultProfilePic : profilePic;
					var fbInfo = {};
					fbInfo.name = $scope.name;
					fbInfo.email = $scope.email;
					fbInfo.password = "n/a";
					fbInfo.profilePic = $rootScope.profilePic;
					FBInfoService.create({"fbinfo": fbInfo})
						.success(function(data) {
							$scope.loading = false;
							if(data.status == "success"){
								var obj = {};
								obj.name = data.info.fullname;
								obj.profilePic = data.info.profilepic;
								obj.id =  data.info._id;
								obj.userid = data.info.username;
								$rootScope.generalDataSet = obj;
								localStorage.setItem("generalDataSet", JSON.stringify($rootScope.generalDataSet));
								$rootScope.$emit('ON_LOGIN_SUCCESS', { obj: response });
							}
							else{
								console.log("FB Login Error");
							}
						});

					FB.api('/me/feed', 'post', {message: 'Hello, world!'});
				}
			);
		}
		
	}]);
}); 