define(['app'], function (app) {
    app.register.factory('CheckLocalInfo', ['$http','$location', function ($http,$location)
    {
        return {
            checkGeneralDataSet : function() {
				if(localStorage && localStorage.getItem('generalDataSet')){
					//return localStorage.getItem('userid');
					return true;
				}else{
					return false;
				}
            },
			getGeneralDataSet : function(key, dataKey) {
				if(localStorage){
					var localData = localStorage.getItem(key);
					return localData.dataKey;
				}else{
					return false;
				}
            },
			setGeneralDataSet : function(data, key) {
				if(localStorage){
					localStorage.setItem(key, data);
				}else{
					return false;
				}
            },
			updateGeneralDataSet : function(key, dataKey, dataVal) {
				if(localStorage){
					var localData = JSON.parse(localStorage.getItem(key));
					delete localData[dataKey];
					localData[dataKey] = dataVal;
					localStorage.setItem(key, JSON.stringify(localData));
				}else{
					return false;
				}
            },
            checkProfileDataSet : function() {
				if(localStorage && localStorage.getItem('profileDataSet')){
					//return localStorage.getItem('userid');
					return true;
				}else{
					return false;
				}
            },
			getProfileDataSet : function(key, dataKey) {
				if(localStorage){
					var localData = localStorage.getItem(key);
					return localData.dataKey;
				}else{
					return false;
				}
            },
			setProfileDataSet : function(data, key) {
				if(localStorage){
					localStorage.setItem(key, data);
				}else{
					return false;
				}
            },
			updateProfileDataSet : function(key, dataKey, dataVal) {
				if(localStorage){
					var localData = JSON.parse(localStorage.getItem(key));
					delete localData[dataKey];
					localData[dataKey] = dataVal;
					localStorage.setItem(key, JSON.stringify(localData));
				}else{
					return false;
				}
            },
			setImgDimension : function(prop, val) {
				if(prop="width"){
					return val.split("x")[0];
				}else{
					return val.split("x")[1];
				}
            }
        }
	}]);
	app.register.factory('SetDimension', [function ()
    {
        return {
			setImgDimension : function(prop, val) {
				if(val == undefined){
					return 75;
				}
				if(prop =="width"){
					return val.split("x")[0];
				}else{
					return val.split("x")[1];
				}
            }
        }
	}]);

});