/**
 * Created by sunil_pandita on 2/19/14.
 */
define(['app'], function (app) {
    app.register.factory('TestService', ['$http','$q', function ($http,$q)
    {
        function getData(url) {
            var d = $q.defer();

            $http({method: "GET", url: url}).
                success(function (data, status) {
                    d.resolve(data);
                }).
                error(function (data, status) {
                    d.reject({data:data,status:status});
                });

            return d.promise;
        };

        var Service = {};
        Service.cache = [];

        Service.getUsersStatsData = function ()
        {
            var url = 'fakedata/applist.json';
            return getData(url);
        };

        return Service;
    }]);
});