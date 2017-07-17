define(['app'], function (app) {
    app.register.factory('SearchHandler', ['$http','$location', function ($http,$location)
    {
		return {
            create : function(searchInfo) {
                return $http.post('/api/trySearch', searchInfo);
            }
        }
	}]);
});