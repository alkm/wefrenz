define(['angularAMD',  'angular-ui-router','bootstrap', 'ui-bootstrap'], function (angularAMD, NavbarController, PublicController)
{
    var app = angular.module("ngAppCenter", ['ui.router', 'ui.bootstrap']);
    app.controller("NavbarController", NavbarController);

    /** Configuring the app path and state using angular-ui-route
     *
     */
    app.config(function($stateProvider,$urlRouterProvider)
    {
        $urlRouterProvider.otherwise("/public");
        //statemanagement for dashboard
			$stateProvider.state('Public',angularAMD.route(
			{
                url:'/public',
                templateUrl: 'partials/public/public.html',
				controller: 'PublicController',
				controllerUrl: 'js/modules/public/controllers/publiccontroller.js'
            }))
			.state('Home',angularAMD.route(
            {
                url:'/home/:userid',
				templateUrl: 'partials/private/home.html',
				controller: 'HomeController',
				controllerUrl: 'js/modules/private/controllers/homecontroller.js'
            }))
			.state('Profile',angularAMD.route(
            {
                url:'/profile/:profileid',
                templateUrl: 'partials/private/profile.html',
				controller: 'ProfileController',
				controllerUrl: 'js/modules/private/controllers/profilecontroller.js'
            }))
        /* State for APPS*/
            .state('Products',angularAMD.route(
                {
                     url:'/products',
                     templateUrl: 'partials/products/appsmainview.html',
                     controller: 'AppListController',
                     controllerUrl: 'js/modules/products/applistcontroller.js',
                     navTab: "products"
                }))
            .state('Products.Detail',angularAMD.route(
                {
                     url:'/products/:appid',
                     templateUrl: 'partials/products/appsitemdetail.html',
                     controller: 'AppItemDetailController',
                     controllerUrl: 'js/modules/products/appitemdetailcontroller.js',
                     navTab: "products"
                }));

    })
	.run(['$rootScope','$state','$stateParams', function($rootScope, $state, $stateParams) {
		$rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
		$rootScope.$on('ON_LOGIN_SUCCESS', function(event, obj) {
			 $state.transitionTo('Home', {userid: obj.username});
		});
		$rootScope.$on('ON_LOGIN_FAILURE', function(event, next) {
           $state.go('Public');
		});
		$rootScope.$on('ON_LOGOUT', function(event, next) {
            $state.transitionTo('Public');
		});
		$rootScope.$on('ON_PROFILE_CLICK', function(event, obj) {
			$state.transitionTo("Profile",{profileid: obj.id});
		});
	}]);
    
    // Bootstrap Angular when DOM is ready
    angularAMD.bootstrap(app);

    return app;
});
