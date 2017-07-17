define(['app','ngload!common/services/appservice'], function (app) {
    app.register.controller('AppListController', ['$scope','$window','$location','AppsService','$filter','$state', function ($scope, $window,$location,AppsService,$filter,$state)
	{
        AppsService.getAllApps(function(data)
        {
           console.log("called the service");
           $scope.lstAppsFromServer=data;
           $scope.filteredApps=data;
           if($scope.filteredApps.length>0)
           {
               $scope.filteredApps[0].selected=true;
               $state.transitionTo("Products.Detail",{appid:$scope.filteredApps[0].appid});
           }
        },
        function(data)
        {
            $scope.lstAppsFromServer=[];
            $scope.filteredApps=[];
            alert("Error occured while getting the app list");
        });

        $scope.getOSType=function(key)
        {
            var osType="";
            if(key)
            {
              switch(key.toLowerCase())
                {
                    case "ios":
                        osType="IOS";
                        break;
                    case "android":
                        osType="Android";
                        break;
                    case "blackberry":
                        osType="BlackBerry";
                        break;
                    case "win8":
                        osType="Windows 8";
                        break;
                    case "symbian":
                        osType="Symbian";
                        break;
                }
            }
            return osType;
        };

        $scope.fetchApps=function(ostype)
        {
            $.each($scope.lstAppsFromServer,function(i,item)
            {
                item.selected=false;

            });

            if(ostype.toLowerCase()=="all")
            {
                $scope.filteredApps=$scope.lstAppsFromServer;
            }
            else
            {
                var lstApps=$scope.lstAppsFromServer;

                var filterApps=$.grep(lstApps,function(item)
                {
                    return item.ostype.toLowerCase()==ostype.toLowerCase();
                });

                if(filterApps!=null && filterApps.length>0)
                {
                    $scope.filteredApps=filterApps;
                }
                else
                {
                    $scope.filteredApps=[];
                }
            }
            if($scope.filteredApps!=null && $scope.filteredApps.length>0)
            {
               $scope.filteredApps[0].selected=true;
               $state.transitionTo("Products.Detail",{appid:$scope.filteredApps[0].appid});
            }
        };

        $scope.selectApp=function(appid)
        {

            $.each($scope.lstAppsFromServer,function(i,item)
            {
                item.selected=false;
                if(item.appid==appid)
                {
                    item.selected=true;
                }
            });

            $state.transitionTo("Products.Detail",{appid:appid});
        };

        $scope.$watch("appsearch.appname",function(query)
        {
            if($scope.lstAppsFromServer!=null)
            {
                $.each($scope.lstAppsFromServer,function(i,item)
                {
                    item.selected=false;

                });
                $scope.filteredApps=$filter("filter")($scope.lstAppsFromServer, query);
                if($scope.filteredApps!=null && $scope.filteredApps.length>0)
                {
                   $scope.filteredApps[0].selected=true;
                   $state.transitionTo("Products.Detail",{appid:$scope.filteredApps[0].appid});
                }
                else
                {
                   $state.transitionTo("Products");
                }
            }
        });
    }]);
});