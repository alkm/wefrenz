define(['app'],function(App)
{
    App.register.directive("chatBuddy",function()
    {
		return {
			restrict: "E",
			templateUrl: "../../../partials/private/snippets/chat/chat_buddy_panel.html"
		}
	});

	App.register.directive("chatWindow", function($timeout) {
		return {
			restrict: "E",
			templateUrl: "../../../partials/private/snippets/chat/chat_window_panel.html",
			link: function(scope, element, attr){
                $timeout(function(){
			        scope.$emit("ON_CHAT_WINDOW_READY", "");
			    });
			}
		}
	});

	App.register.directive('ngEnter', function () {
		return function (scope, element, attrs) {
			element.bind('keydown keypress', function (event) {
				if(event.which === 13) {
					if (scope.$root.$phase != '$apply' && scope.$root.$$phase != '$digest') {
						scope.$apply(function (){
							scope.$eval(attrs.ngEnter, {$event:event});
						});
						event.preventDefault();
					}
				}
			});
		};
	});
});