define(['app','common/services/appservice','common/directives/acratingdirective'], function (app) {
    app.register.controller('AppItemDetailController', ['$scope', '$window','$state','AppsService', function ($scope, $window,$stateParams,AppsService)
	{
        $scope.selectedAppId=$stateParams.appid?$stateParams.appid:$stateParams.params.appid;

        $scope.app=AppsService.getAppForId( $scope.selectedAppId);

        $scope.seeMore=false;
        $scope.seeMoreText="See More ►";

        $scope.onSeeMoreClick=function()
        {
           $scope.seeMore= !$scope.seeMore;
            if($scope.seeMore)
            {
                $scope.seeMoreText="See Less ▲";
            }
            else
            {
                $scope.seeMoreText="See More ►";
            }
        }

    }]);
});