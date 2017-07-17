define(['app'],function(App)
{
    App.register.filter("fltUN", function(){
		// In the return function, we must pass in a single parameter which will be the data we will work on.
		// We have the ability to support multiple other parameters that can be passed into the filter optionally
		return function(username) {
			var un = username.split("@")[0];
			// Do filter work here
			return un;
		}
	});
});