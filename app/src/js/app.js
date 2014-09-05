'use strict';

var app = angular.module('myApp', [
			'highcharts-ng',
			'ngRoute',
			'firebase',
			'ui.bootstrap',
			'ui.router',
			'LocalStorageModule',
			'ngAnimate',
			'myApp.directives',
			'myApp.filters',
			'myApp.services',
			'myApp.controllers',
			'myApp.chart_controllers'
		]).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

			$urlRouterProvider.otherwise("/home");

			$stateProvider
					.state('home', {
						url: "/home",
						views : {
							"mainView" : {templateUrl : "partials/home.html"}
						}
					});

			$stateProvider
					.state('info', {
						url: "/info",
						views : {
							"mainView" : {templateUrl : "partials/info.html"}
						}
					});

			$stateProvider
					.state('auth', {
						url: "/auth",
						views : {
							"mainView" : {templateUrl : "partials/auth/form.html"}
						}
					});

			$stateProvider
					.state('forgot-password', {
						url: "/forgot-password",
						views : {
							"mainView" : {templateUrl : "partials/auth/forgot-password.html"}
						}
					});

			$stateProvider
					.state('reset-password', {
						url: "/reset-password",
						views : {
							"mainView" : {templateUrl : "partials/auth/reset-password.html"}
						}
					});

			$stateProvider
					.state('calculator', {
						abstract:true,
						url: "/calculator",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {
								templateUrl : "partials/results/chart_high.html"
							}
						}
					});

			$stateProvider
					.state('calculator.index', {
						url: "",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {
								templateUrl : "partials/results/chart_high.html"
							}
						}
					});

			$stateProvider
					.state('calculator.chart_high', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						}
					});

			$stateProvider
					.state('calculator.chart_low', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_low.html"}
						}
					});

			$stateProvider
					.state('calculator.table', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/results/table.html"}
						}
					});

			$stateProvider
					.state('calculator.test', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/test.html"}
						}
					});

			$stateProvider
					.state('clear-data', {
						url: "/clear-data",
						views : {
							"mainView" : {
								templateUrl : "partials/clear-data.html",
								controller : 'ClearDataCtrl'
							}
						}
					});

			$stateProvider
					.state('clear-data-confirm', {
						url: "/clear-data-confirm",
						views : {
							"mainView" : {
								templateUrl : "partials/clear-data-confirm.html",
								controller : 'ClearDataCtrl'
							}
						}
					});

			$stateProvider
					.state('saved-calculations', {
						url: "/saved-calculations",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations.html",
								controller : 'ListSessionCtrl'
							}
						}
					});

			$stateProvider
					.state('saved-calculations-detail', {
						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller: 'SessionsDetailCtrl'
							}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.chart_high', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.chart_low', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_low.html"}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.table', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/results/table.html"}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.test', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/test.html"}
						}
					});

			$stateProvider
					.state('save-calculation', {
						url: "/save-calculation",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/save-calculation.html",
								controller : 'SaveSessionCtrl'
							}
						}
					});

			$stateProvider
					.state('update-calculation', {
						url: "/update-calculation",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/update-calculation.html",
								controller : 'UpdateSessionCtrl'
							}
						}
					});

		}
		]);