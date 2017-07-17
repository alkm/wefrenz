require.config({

    baseUrl: "js/",
    
	// alias libraries paths
    paths: {
		'jquery': '../../libs/jquery/jquery.min',
		/*'scroller': '../../libs/scroller/jquery.mCustomScrollbar.concat.min',*/
        'angular': '../../libs/angular/angular.min',
        'angular-route': '../../libs/angular-route/angular-route',
        'angular-ui-router':'../../libs/angular-ui-route/angular-ui-router.min',
		'angular-cookies':'../../libs/angular-cookies/angular-cookies',
		'angular-sanitize':'../../libs/angular-sanitize/angular-sanitize',
        'async': '../../libs/requirejs/async',
        'angularAMD': '../../libs/angularAMD/angularAMD',
        'ngload': '../../libs/angularAMD/ngload',
		'ui-bootstrap': '../../libs/angular-ui-bootstrap/ui-bootstrap-tpls-1.3.3.min',
        'prettify': '../../libs/google-code-prettify-lite/prettify',
		'highstocks': '../../libs/highcharts/highcharts',
		'highchartsng': '../../libs/highcharts-ng/highcharts-ng',
		'bootstrap': '../../libs/bootstrap/js/bootstrap.min',
		/*'socket-io': '../../libs/socket.io/socket.io-1.4.5',*/
		/*'rtc-lib': '../js/easyrtc/easyrtc',
		'audio-video': '../js/easyrtc/demo_audio_video',*/
		'drag-bg': '../../libs/drag-bg/dragbg',
		'userinfo-service': '../js/common/services/userinfoservice',
		'friend-service': '../js/modules/private/services/friendservice',
		'search-service': '../js/modules/private/services/searchservice',
		'chat-controller': '../js/modules/private/controllers/chatcontroller',
		'changeprofilepicmodal-controller': '../js/modules/private/controllers/modals/changeprofilepicmodalcontroller',
		'imgcrop-directive': '../js/modules/private/directives/imgcropdirective',
		'resource-directive': '../js/modules/private/directives/resourcedirective',
		'chat-directive': '../js/modules/private/directives/chatdirective',
		'chat-service': '../js/modules/private/services/chatservice',
		'profile-service': '../js/modules/private/services/profileservice', 
		'utility-service': '../js/modules/private/services/utilityservice',
		'search-controller': '../js/modules/private/controllers/searchcontroller',
		'notification-controller': '../js/modules/private/controllers/notification/notificationcontroller',
		'resource-filter': '../js/modules/private/filters/resourcefilter'
    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angular':['jquery'],
        /*'scroller':['jquery'],*/
        /*'easy-rtc':['socket-io'],
		'audio-video':['easy-lib'],*/
        'angularAMD': ['angular'],
        'angular-ui-router':['angular'],
		'angular-cookies':['angular'],
		'angular-sanitize':['angular'],
		'ui-bootstrap': ['angular'],
		'highchartsng':
		{
			deps:['highstocks']
		},
		'bootstrap':
		{
			deps:['jquery']
		}/*,
		'rtc-lib':{
			deps:['socket-io']
		},
		'audio-video':{
			deps:['rtc-lib']
		}*/
    },

    // kick start application
    deps: ['app']
});

function testLoginState(){
	sessionStorage.isLogout = 0;
	$.event.trigger({
		type: "TEST_LOGIN_STATE",
		obj: "",
		time: new Date()
	});
}
