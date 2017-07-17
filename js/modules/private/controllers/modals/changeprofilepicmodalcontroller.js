define(['app', 'ngload!imgcrop-directive', 'ngload!profile-service', 'ngload!utility-service'], function (app) {
    app.register.controller('ChangeProfilePicModalController', ['$rootScope', '$scope', '$window', '$state', '$timeout' , '$uibModalInstance', 'ProfilePicUpload', 'CheckLocalInfo', function ($rootScope, $scope, $window, $state, $timeout, $uibModalInstance, ProfilePicUpload, CheckLocalInfo)
	{
		$scope.isFINShow = false;
		$rootScope.isCropShow = false;
		$scope.isCoppedImgShow = false; 
		$rootScope.isProfilePicCamShow = false;
		$scope.cropper = {};
		$scope.cropper.sourceImage = null;
		$scope.cropper.croppedImage   = null;
		$rootScope.cropWidth = 0;
		$rootScope.cropHeight = 0;
		var video = null;
		var localStream = null;
		
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
		$scope.ok = function() {
			$uibModalInstance.dismiss('cancel');
		};
		$scope.openImgOption = function(){
			$("#profilePicUpload").click();
        }
		
		$scope.rotate = function (angle) {
			alert("rotate");
			$scope.angle = angle;
		};
		
		// $scope.selected = function (cords) {
			// $scope.isProfilePicCamShow = false; 
			// $rootScope.isCropShow = true;
			// $scope.cropped = true;
			// var rx = 150 / cords.w;
			// var ry = 150 / cords.h;
			// $('#preview').css({
			// width: Math.round(rx * boundx) + 'px',
			// height: Math.round(ry * boundy) + 'px',
			// marginLeft: '-' + Math.round(rx * cords.x) + 'px',
			// marginTop: '-' + Math.round(ry * cords.y) + 'px'
			// });
		// };
		function saveProfilePic(imgData){
			var generalDataSet = JSON.parse(localStorage.getItem("generalDataSet"));
			var profilePicInfo = {};
			profilePicInfo.profilePicEncoded = imgData;
			profilePicInfo.id = generalDataSet._id;
			profilePicInfo.previewPicDimension = $rootScope.previewPicWidth+"x"+$rootScope.previewPicHeight;
			profilePicInfo.profilePicDimension = $rootScope.profilePicWidth+"x"+$rootScope.profilePicHeight;
			ProfilePicUpload.create({"profilepicinfo": profilePicInfo})
				.success(function(data) {
				$scope.loading = false;
				if(data.status == "success"){
					$rootScope.profilePic = data.profilepic.imageBuffer;
					CheckLocalInfo.updateGeneralDataSet("generalDataSet", "profilepic", data.profilepic);
				}
				else{
				}
			});
			
		}
		$scope.saveCroppedImg = function(){
			var offsetWidth = $rootScope.ch/$rootScope.cw;
			$("#croppedImg > img").width(150);
			$("#croppedImg > img").height(150*offsetWidth);
			$rootScope.previewPicWidth = 100;
			$rootScope.previewPicHeight = 100*offsetWidth;
			if($rootScope.previewPicHeight != 100){
				$rootScope.previewPicHeight = 100;
				$rootScope.previewPicWidth = 100*(1/offsetWidth);
			}
			$rootScope.profilePicWidth = 75;
			$rootScope.profilePicHeight = 75*offsetWidth;
			if($rootScope.profilePicHeight != 75){
				$rootScope.profilePicHeight = 75;
				$rootScope.profilePicWidth = 75*(1/offsetWidth);
			}
			// $(".profile-pic-content > img").width(75);
			// $(".profile-pic-content > img").height(75*offsetWidth);
			// if($(".profile-pic-content > img").height() != 75){
				// $(".profile-pic-content > img").height(75);
				// $(".profile-pic-content > img").width(75*(1/offsetWidth));
			// }
			saveProfilePic($scope.cropper.croppedImage);
		}
		$scope.takeProfilePic = function(event){
			$rootScope.isProfilePicCamShow = true; 
			$rootScope.isCropShow = false;
			video = document.getElementById('profilePicVideo');
			var canvas = document.getElementById('profilePicCanvas');
			var ctx = canvas.getContext('2d');
			navigator.getUserMedia  = navigator.getUserMedia ||
							  navigator.webkitGetUserMedia ||
							  navigator.mozGetUserMedia ||
							  navigator.msGetUserMedia;
			var errorCallback = function(e) {
				console.log('Reeeejected!', e);
			};
			video.addEventListener('play', function() {
				var $this = this; //cache
				(function loop() {
				  if (!$this.paused && !$this.ended) {
					ctx.drawImage($this, 0, 0, 320, 180);
					// $("#profilePicCanvas").css("height", $("#profilePicVideo").height());
					// $("#profilePicCanvas").css("width", $("#profilePicVideo").width());
					setTimeout(loop, 1000 / 30); // drawing at 30fps
				  }
				})();
			}, 0);

			if (navigator.getUserMedia) {
			  navigator.getUserMedia({audio: false, video: true}, function(stream) {
				  localStream = stream;
				video.src = window.URL.createObjectURL(stream);
			  }, errorCallback);
			} else {
				alert("Your Browser does not support Camera");
			  //video.src = 'somevideo.webm'; // fallback.
			}
		
		}
		$rootScope.$on('ON_STOP_CAM_STREAM', function(event, next) {
			if(localStream != null){
				//localStream.stop();
				var track = localStream.getTracks()[0];  // if only one media track
				track.stop();
			}
		});
		$scope.saveCamImg = function(){
			var canvas = document.getElementById('profilePicCanvas');
			initProfilePicUpload(canvas);
		}	
		function initProfilePicUpload(canvas) {
			var generalDataSet = JSON.parse(localStorage.getItem("generalDataSet"));
			var dataURI = canvas.toDataURL();
			saveProfilePic(dataURI);
		}
		
		// $rootScope.$on('ON_GET_CROPPED_ASPECT_RATIO', function(event, obj) {
			// console.log("??????/"+obj.aspectRatio.height);
			// var offsetWidth = obj.aspectRatio.height/obj.aspectRatio.width
			// $("#croppedImg > img").width(150);
			// $("#croppedImg > img").height(150*offsetWidth);
			// $(".pic-medium > img").width(100);
			// $(".pic-medium > img").height(100*offsetWidth);
			// $(".profile-pic-content > img").width(50);
			// $(".profile-pic-content > img").height(50*offsetWidth);
		// });
		
    }
		
	]);
	
}); 