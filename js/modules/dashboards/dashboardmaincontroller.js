define(['app','ngload!highchartsng'], function (app) {
    app.register.controller('DashboardMainController', ['$scope', '$window', function ($scope, $window)
	{
        $scope.title = "Mobile Shop Dashboards";
		
		//pie chart
		$scope.appOSpieChart={
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false
			},
			title: {
				text: '%Mobiles purchased by OS'
			},
			subtitle: {
				text: ''
			},
			series: [{
				type: 'pie',
				name: 'Mobiles purchased by OS',
				data: [
					['Android',   40.0],
					['IOS',       27.0],
					['Blackberry',13.0],
					['Win Mobile', 12.0],
					['Palm OS',    4.5],
					['Symbian',     3.5]
				]
			}]
		};

		//bar chart
		$scope.barChartoptions={
			chart: {
				type: 'column'
			},
			title: {
				text: 'Number of Mobiles purchased'
			},
			subtitle: {
				text: 'Period Jun 2103 to Dec 2013'
			},
			xAxis: {
				categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				title:{
					text:"Months"
				}
			},

			yAxis: {
				title:{
					text:"Mobiles purchases"
				}
			},

			plotOptions: {
				series: {
					cursor: 'pointer'
				}
			},

			series: [{
				type: 'column',
				data: [ 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,240.3]
			}]
		};
	}]);
}); 