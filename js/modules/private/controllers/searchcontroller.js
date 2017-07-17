define(['app', 'ngload!resource-directive'], function (app) {
    app.register.controller('SearchController', ['$rootScope', '$scope', '$window', 'SearchHandler', function ($rootScope, $scope, $window, SearchHandler)
	{
			//Initialising socket connections for Chat App
		angular.element(document).ready(function() {
		
		});
		$scope.searchInfo = {};
		$scope.onSearchRequest = function(){
            SearchHandler.create($scope.searchInfo)
				.success(function(data) {
                $(".navbar-brand > ul").empty();
                $scope.searchResult = [];
                if(data.length >= 1){
                    for (var obj in data){
                        $scope.searchResult.push(data[obj]);
                    }
                   // generateSearchResultUI($scope.searchResult);
                }

            });

        }
		
        function generateSearchResultUI(searchResultData){
            console.log(searchResultData);
            var html="<ul id='searchResultContainer'></ul>";
            $(".search-box").append(html);
            for(var items in searchResultData){
                $("<li class='search-list' id='"+searchResultData[items]._id+"'><img src='"+searchResultData[items].profilepic+"'/><span>"+searchResultData[items].fullname+"</span></li>").appendTo($(".search-box > ul"));
            }
        }
		
	}]);
}); 