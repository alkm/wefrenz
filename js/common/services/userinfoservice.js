define(['app'], function (app) {
    app.register.factory('LogInInfoService', ['$http','$location', function ($http,$location)
    {
		return {
            get : function() {
                return $http.get('/api/logInInfo');
            },
            create : function(logInInfo) {
                return $http.post('https://localhost:3000/api/logInInfo', logInInfo);
            },
            delete : function(id) {
                return $http.delete('/api/logInInfo/' + id);
            }
        }
	}]);
	app.register.factory('FBInfoService', ['$http', function ($http)
    {
		return {
            create : function(fbInfo) {
                return $http.post('/api/fbInfo', fbInfo);
            }
        }
	}]);
	
	app.register.factory('SignUpInfoService', ['$http', function ($http)
    {
		return {
            create : function(userInfo) {
                return $http.post('/api/signUpInfo', userInfo);
            }
        }
	}]);

    app.register.factory('ProfileInfoService', ['$http', function ($http)
    {
        return {
            get : function(profileInfo) {
                return $http.post('/api/getProfileDataSet', profileInfo);
            }
        }
    }]);
        
});