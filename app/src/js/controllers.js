'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

		.controller('InfoCtrl',
				[
					'$rootScope',
					'$scope',
					'localStorageService',
					'$firebaseSimpleLogin',
                    'Authorisation',
					'infoData', function ($rootScope, $scope, localStorageService, $firebaseSimpleLogin, Authorisation, infoData) {

                    Authorisation.loginObj.$getCurrentUser().then(
							function (user) {
								$scope.user_forms_ready = true;
								if ( user === null ) {
									infoData.loggedIn = false;
								} else {
									infoData.loggedIn = true;
								}
							}
					);

					/**
					 *  Fast click, removes time delay for click on mobile
					 */
					FastClick.attach(document.body, null);

					/**
					 * Check logged in
					 * @type {Firebase}
					 */
					$scope.$on('isLoggedInMessage', function (event, msg) {
						infoData.loggedIn = msg;
					});

					/**
					 *  Check net is up
					 */
						// Default value for flag
					$scope.isNetUp = true;

					// Checks whether net is up
					Offline.on('confirmed-up', function () {
						// Update flag
						$scope.isNetUp = true;
						return true;
					});

					// Checks whether net is down
					Offline.on('confirmed-down', function () {
						// Update flag
						$scope.isNetUp = false;
						return false;
					});

					/**
					 *  Resizing the windows updates various elements
					 */
					$scope.resizeContentWrapper = function (ele_id) {
						$scope.winHeight = document.documentElement.clientHeight;
						ele_id.setAttribute('style', 'height: ' + $scope.winHeight + 'px');
					};

					// Store ele in variable
					var wrap = document.getElementById('wrap');

					// On resize
					$(window).resize(function () {
						$scope.resizeContentWrapper(wrap);
					});

					// Call resize on page load
					$scope.resizeContentWrapper(wrap);

					/**
					 *  User information
					 */
						// Update info, store in localstorage and send data back to infoData
					$scope.updateInfo = function () {
						// Add latest timestamp and date
						$scope.info.date = {
							timestamp : Math.round(new Date().getTime() / 1000),
							date : new Date().toISOString()
						};
						localStorageService.set('info', $scope.info);
					};

					/**
					 * Called when infoData updates, changes to infoData go here
					 */
					$scope.$watch(function () {
								return infoData;
							},
							function (newVal, oldVal) {
								$scope.setCurrency();
								$scope.currency = infoData.currency.symbol;
								$scope.info = infoData;
							}, true);

					$scope.currency_symbols = {
						'Dollar': '$', // Dollar
						'Euro': '€', // Euro
						'Colón': '₡', // Colón
						'Pound': '£', // Pound
						'Sheqel': '₪', // Sheqel
						'Rupee': '₹', // Rupee
						'Yen': '¥', // Yen
						'Won': '₩', // Won
						'Naira': '₦', // Naira
						'Peso': '₱', // Peso
						'Zloty': 'zł', // Zloty
						'Guarani': '₲', // Guarani
						'Baht': '฿', // Baht
						'Hryvnia': '₴', // Hryvnia
						'Dong': '₫' // Dong
					};

					/**
					 * Currency
					 */
					$scope.setCurrency = function () {
						var currency_symbols = {
							'ARS': $scope.currency_symbols['Dollar'], // Dollar
							'AUD': $scope.currency_symbols['Dollar'], // Australian Dollar
							'USD': $scope.currency_symbols['Dollar'], // US Dollar
							'EUR': $scope.currency_symbols['Euro'], // Euro
							'CRC': $scope.currency_symbols['Colón'], // Costa Rican Colón
							'EGP': $scope.currency_symbols['Pound'], // Egyptian Pound
							'FKP': $scope.currency_symbols['Pound'], // Falkland Islands Pound
							'GIP': $scope.currency_symbols['Pound'], // Gibraltar Pound
							'GBP': $scope.currency_symbols['Pound'], // British Pound Sterling
							'ILS': $scope.currency_symbols['Sheqel'], // Israeli New Sheqel
							'INR': $scope.currency_symbols['Rupee'], // Indian Rupee
							'JPY': $scope.currency_symbols['Yen'], // Japanese Yen
							'KRW': $scope.currency_symbols['Won'], // South Korean Won
							'NGN': $scope.currency_symbols['Naira'], // Nigerian Naira
							'PHP': $scope.currency_symbols['Peso'], // Philippine Peso
							'PLN': $scope.currency_symbols['Zloty'], // Polish Zloty
							'PYG': $scope.currency_symbols['Guarani'], // Paraguayan Guarani
							'THB': $scope.currency_symbols['Baht'], // Thai Baht
							'UAH': $scope.currency_symbols['Hryvnia'], // Ukrainian Hryvnia
							'VND': $scope.currency_symbols['Dong'] // Vietnamese Dong
						};

						if (infoData.currency) {
							if (currency_symbols[infoData.currency.currency] !== undefined) {
								infoData.currency = {
									currency: infoData.currency.currency,
									symbol : currency_symbols[infoData.currency.currency]
								}
							} else {
								infoData.currency = {
									currency: infoData.currency.currency,
									symbol : infoData.currency.symbol
								}
							}
						} else {
							infoData.currency = {
								currency: 'USD',
								symbol : '$'
							}
						}
					};

					/**
					 * Called whenever the state changes (pages change)
					 * Menu active from state names
					 */
					$scope.$on('$stateChangeSuccess',
							function (event, toState, toParams, fromState, fromParams) {
								console.log(toState.name);
								switch (toState.name) {
									case 'home' :
										$scope.navActive = 'home';
										break;
									case 'info' :
										$scope.navActive = 'info';
										break;
									case 'calculator.index' :
										$scope.navActive = 'calculator';
										break;
									case 'calculator.chart_high' :
										$scope.navActive = 'calculator';
										break;
									case 'calculator.chart_low' :
										$scope.navActive = 'calculator';
										break;
									case 'calculator.test' :
										$scope.navActive = 'calculator';
										break;
									case 'saved-calculations' :
										$scope.navActive = 'my-calculations';
										break;
									case 'saved-calculations-detail' :
										$scope.navActive = 'my-calculations';
										break;
									case 'clear-data' :
										$scope.navActive = 'settings';
										break;
									case 'auth' :
										$scope.navActive = 'auth';
										break;
								}
							});

				}])

		.controller('ClearDataCtrl',
				[
					'$scope',
					'$window',
					'localStorageService',
					'$location',
					'infoData',
					'inputData',
					'allData',
					'$state',
					'$timeout',
					'$templateCache',
					function ($scope, $window, localStorageService, $location, infoData, inputData, allData, $state, $timeout, $templateCache) {
						/**
						 *  Logs out the user and clears locally stored data
						 */
						$scope.orig = angular.copy($scope.input);

						$scope.confirmClearData = function () {

							localStorageService.clearAll();

							$scope.input = angular.copy($scope.orig);

							$templateCache.removeAll();

							// Reset factories
							infoData = {};
							inputData = {};
							allData = {};

							// Reset models
							$scope.info = {
								data : "reset"
							};
							$scope.input = {
								data : "reset"
							};

							// Redirect to next step
							$state.transitionTo('clear-data-confirm');
							$timeout(function () {
								$window.location.reload();
							}, 10);
						};

						/**
						 * Once logout has been confirmed, start over
						 */
						$scope.startOver = function () {
							$state.go('info');
						};

					}])

		.controller('ListSessionCtrl',
				[
					'$scope',
					'$state',
					'$firebase',
					'$firebaseSimpleLogin',
                    'Authorisation',
					'$timeout',
					'localStorageService',
					'infoData',
					'inputData',
					'allData',
					'$location',
					'$modal',
					function ($scope, $state, $firebase, $firebaseSimpleLogin, Authorisation, $timeout, localStorageService, infoData, inputData, allData, $location, $modal) {

                        Authorisation.loginObj.$getCurrentUser().then(
								function (user) {
									if ( user === null ) {
										// TODO-mike add message
										// Logged in: no
										// - Message 'you need to login before updating'
										// - redirect to auth page
									} else {
										// Logged in: yes
										// - get current user id and append to firebase address
										var userId = user.id;

										/**
										 *  Gets saved calculations from firebase
										 *
										 * @type {*}
										 */
										var sync = $firebase(new Firebase(Authorisation.url + 'user_data/' + userId + "/")),
												items = sync.$asArray();

										/* Promise for loaded data */
										items.$loaded().then(
												function () {
													$scope.items = items;
													$scope.load_status = "loaded";
													$scope.ele_load_status = "show_on_loaded";
												}
										);

										/**
										 *  Get current key
										 */
										$scope.current_key = localStorageService.get('current_key');

										/**
										 * Loading data preloading
										 */
										$scope.load_status = "loading";
										$scope.ele_load_status = "hide_on_loading";

										/**
										 * Count saved calculations
										 *
										 * @returns {y.length|*|z.length|dummy.length|length|mfn.length}
										 */
										$scope.sessionCount = function () {
											return items.length;
										};

										/**
										 *  Delete saved calculations
										 *
										 *  @param id
										 */
										$scope.deleteSession = function (id) {

											var itemToRemove = items.$getRecord(id);

											$scope.deleteItemId = id;

											$timeout(function () {
												items.$remove(itemToRemove).then(function(ref) {
													$state.go('saved-calculations');
												});
											}, 400);

										};

										/**
										 *  Copy a saved calculation
										 *
										 *  @param id
										 */
										$scope.copySession = function (id) {

											// Connect to firebase and retrieve saved calculations
											var sync = $firebase(new Firebase(Authorisation.url + '/user_data/' + userId + "/" + id)),
													item = sync.$asObject();

											/* Promise for loaded data */
											item.$loaded().then(
													function () {
														// Copy saved data
														var copy_of_data = item.data,
																copy_of_info = item.info,
																copy_of_input = item.input;

														// Update the timestamp and date
														copy_of_info.date = {
															timestamp : Math.round(new Date().getTime() / 1000),
															date : new Date().toISOString()
														};

														// Add to items object the copied data
														$scope.items.$add({
															data : copy_of_data,
															info : copy_of_info,
															input : copy_of_input
														});
													}
											);
										};

										/**
										 *  Use a particular saved calculation,
										 *  replaces data in local storage with this copied calculation
										 *
										 *  @param id
										 */
										$scope.useSession = function (id) {

											$scope.id = id;

											var modalInstance = $modal.open({
												templateUrl : 'useSession.html',
												controller : 'ModalConfirmUseCtrl',
												size : 'sm',
												resolve : {
													id : function () {
														return id;
													}
												}
											});

										};

									}
								}
						);

					}])

		.controller('ModalConfirmUseCtrl',
				[
					'$scope',
					'$window',
					'$firebase',
					'$firebaseSimpleLogin',
                    'Authorisation',
					'$state',
					'allData',
					'infoData',
					'inputData',
					'localStorageService',
					'$modalInstance',
					'id', function ($scope, $window, $firebase, $firebaseSimpleLogin, Authorisation, $state, allData, infoData, inputData, localStorageService, $modalInstance, id) {

					$scope.id = id;

					$scope.ok = function () {

						// Check logged in

						// Connect to firebase to retrieve saved calculation with id
                        Authorisation.loginObj.$getCurrentUser().then(
								function (user) {
									if ( user === null ) {
										// TODO-mike test it can get to this and add message if so
									} else {
										var userId = user.id;

										var sync = $firebase(new Firebase(Authorisation.url + '/user_data/' + userId + "/" + id)),
												item = sync.$asObject();

										/* Promise for loaded data */
										item.$loaded().then(
												function () {

													// Set the locally stored data
													localStorageService.set('data', item.data);
													localStorageService.set('info', item.info);
													localStorageService.set('input', item.input);

													// Update the factories
													allData = item.data;
													infoData = item.info;
													inputData = item.input;

													// Set the current key in localstorage
													localStorageService.set('current_key', id);

													// Set current_key
													$scope.current_key = localStorageService.get('current_key');

													// Set running session flag to true
													infoData.running_session = true;

													$window.location.reload();

													$modalInstance.close();
												}
										);

									}
								}
						);
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};

				}])

		.controller('SessionsDetailCtrl',
				[
					'$rootScope',
					'$scope',
					'$routeParams',
					'$firebase',
					'$firebaseSimpleLogin',
                    'Authorisation',
					'$state',
					'$stateParams',
					'chartData', function ($rootScope, $scope, $routeParams, $firebase, $firebaseSimpleLogin, Authorisation, $state, $stateParams, chartData) {

                    Authorisation.loginObj.$getCurrentUser().then(
							function (user) {
								if ( user === null ) {
									// TODO-mike add message
									// Logged in: no
									// - Message 'you need to login before saving'
									// - redirect to auth page
								} else {

									var userId = user.id;

									/* Get associated session item from Firebase */
									var sync = $firebase(new Firebase(Authorisation.url + '/user_data/' + userId + '/' + $stateParams.id)),
											item = sync.$asObject();

									/* Promise for loaded data */
									item.$loaded().then(
											function () {
												$scope.item = item;

												var data = $scope.item.data;

												$scope.currency = item.info.currency.symbol;

												/**
												 * Calls the factories for each service
												 */
												$scope.updateData = function () {

													$scope.revenue_integrity = data.revenue_integrity;

													$scope.revenue_integrity_process_improvement = data.revenue_integrity_process_improvement;

													$scope.cmap = data.cmap;

													$scope.origin_and_destination = data.origin_and_destination;

													$scope.pos = data.pos;

													$scope.arr = data.arr;

													$scope.airfare_insight = data.airfare_insight;

													// TODO-mike separate values for both graph types
													// chart configs are not storing separate values for both graphs.
													// Need to find out why and stop from using this sort of if/else as makes it fragile.
													if ( $state.current.name === 'saved-calculations-detail.chart_low' ) {
														$scope.chartConfigLow = chartData.drawChart('low', data);
													} else {
														$scope.chartConfigHigh = chartData.drawChart('high', data);
													}

												};
												$scope.updateData();

												$state.go('saved-calculations-detail.chart_high');

												/**
												 * View state
												 *
												 * Saves the state of the open results view, Charts or table,
												 * when loaded. Uses state and state change success event ($stateChangeSuccess).
												 */
												$rootScope.$on('$stateChangeSuccess',
														function (event, toState, toParams, fromState, fromParams) {
															// update chart
															$scope.updateData();
														});

											}
									);

								}
							});

				}])

		.controller('SessionsCtrl', ['$scope', 'FbService', 'FbService2', function ($scope, FbService, FbService2) {

			/**
			 *  Firebase
			 */
			$scope.fbtest = function () {
				$scope.text.sum = 0;
				FbService2.$bind($scope, "text");
			};

			/**
			 * Firebase: testing - not used in app
			 * @param num
			 * @param num2
			 * @returns {Number}
			 */
			$scope.sum = function (num, num2) {
				return parseInt(num + num2);
			};
		}])

		.controller('SaveSessionCtrl',
				[
					'$scope',
					'localStorageService',
					'$firebase',
					'$firebaseSimpleLogin',
					'$timeout',
					'infoData',
                    'Authorisation', function ($scope, localStorageService, $firebase, $firebaseSimpleLogin, $timeout, infoData, Authorisation) {

					/**
					 * Check current_key exists
					 * It means we're currently running a session
					 */
					if ( localStorageService.get('current_key') ) {
						$scope.info.running_session = true;
					} else $scope.info.running_session = false;

					// Save status flags
					$scope.saving = false;
					$scope.saved = false;

					/**
					 * Save session to Firebase
					 */
					$scope.saveSession = function () {

                        Authorisation.loginObj.$getCurrentUser().then(
								function (user) {
									if ( user === null ) {
										// TODO-mike add message
										// Logged in: no
										// - Message 'you need to login before saving'
										// - redirect to auth page
									} else {
										// Logged in: yes
										// - get current user id and append to firebase address
										var userId = user.id;

										// Store to Firebase address
										var sync = $firebase(new Firebase(Authorisation.url + '/user_data/' + userId + '/')),
												items = sync.$asArray();

										// Set flag: saving to true
										$scope.saving = true;

										// Add the data from localstorage and add it to Firebase
										items.$add({
											info : localStorageService.get('info'),
											input : localStorageService.get('input'),
											data : localStorageService.get('data')
										}).then(function (ref) {

											// Once added retrieve the ref id and set in localstorage
											localStorageService.set('current_key', ref.name());

											// Update running_session flag
											$scope.info.running_session = true;

											// Saving has finished so reset saving flag
											$scope.saving = false;

											// And flag that it's been saved
											$scope.saved = true;

											// After a while set the saved flag back to default, this takes saved message back off screen
											$timeout(function () {
												$scope.saved = false;
											}, 2500);

										});
									}
								}
						);

					};

					/**
					 * Updates the current calculation and uploads it to Firebase
					 */
					$scope.updateSession = function () {

						// Check logged in
                        Authorisation.loginObj.$getCurrentUser().then(
								function (user) {
									if ( user === null ) {
										// TODO-mike add message
										// Logged in: no
										// - Message 'you need to login before updating'
										// - redirect to auth page
									} else {
										// Logged in: yes
										// - get current user id and append to firebase address
										var userId = user.id;

										// we are currently running a calculation/session
										if ( $scope.info.running_session === true ) {

											// Set flag: saving to true
											$scope.saving = true;

											// Get the link to the firebase item with id key from localstorage
											$scope.items = $firebase(new Firebase(Authorisation.url + '/user_data/' + userId + "/" + localStorageService.get('current_key')));

											// Set and update the firebase item with new values from localstorage
											$scope.items.$set({
												info : localStorageService.get('info'),
												input : localStorageService.get('input'),
												data : localStorageService.get('data')
											}).then(function () {

												// Saving has finished so reset saving flag
												$scope.saving = false;

												// And flag that it's been saved
												$scope.saved = true;

												// After a while set the saved flag back to default, this takes saved message back off screen
												$timeout(function () {
													$scope.saved = false;
												}, 2500);
											});
										}

									}
								}
						);
					}
				}])

		.controller('TestCtrl',
				[
					'$rootScope',
					'$scope',
					'$location',
					'localStorageService',
					'$state',
                    'Authorisation',
					'chartData',
					'chartConfig',
					'inputData',
					'allData',
					'revenueIntegrity',
					'revenueIntegrityProcessImprovement',
					'cmap',
					'originAndDestination',
					'pointOfSale',
					'passengersBoardedData',
					'arr',
					'airfareInsight',
					'channelShift',
					'ancillarySales',
					function ($rootScope, $scope, $location, localStorageService, $state, Authorisation, chartData, chartConfig, inputData, allData, revenueIntegrity, revenueIntegrityProcessImprovement, cmap, originAndDestination, pointOfSale, passengersBoardedData, arr, airfareInsight, channelShift, ancillarySales) {

						/**
						 * Calls the factories for each service
						 */
						$scope.updateData = function () {

                        Authorisation.loginObj.$getCurrentUser().then(
                                function (user) {
                                    if (user === null) {

                                    } else {
                                        console.log(user.id);
                                    }
                                }
                            );

							revenueIntegrity.initObject();
							$scope.revenue_integrity = allData.revenue_integrity;

							revenueIntegrityProcessImprovement.initObject();
							$scope.revenue_integrity_process_improvement = allData.revenue_integrity_process_improvement;

							channelShift.initObject();
							$scope.channel_shift = allData.channel_shift;

							ancillarySales.initObject();
							$scope.ancillary_sales = allData.ancillary_sales;

							cmap.initObject();
							$scope.cmap = allData.cmap;

							originAndDestination.initObject();
							$scope.origin_and_destination = allData.origin_and_destination;

							pointOfSale.initObject();
							$scope.pos = allData.pos;

							arr.initObject();
							$scope.arr = allData.arr;

							airfareInsight.initObject();
							$scope.airfare_insight = allData.airfare_insight;

							localStorageService.set('data', allData);
							localStorageService.set('input', inputData);

							// TODO-mike separate values for both graph types
							// chart configs are not storing separate values for both graphs.
							// Need to find out why and stop from using this sort of if/else as makes it fragile.
							if ( $state.current.name === 'calculator.chart_low' ) {
								$scope.chartConfigLow = chartData.drawChart('low', localStorageService.get('data'));
							} else {
								$scope.chartConfigHigh = chartData.drawChart('high', localStorageService.get('data'));
							}

						};

						$scope.updateData();

						// Passengers boarded data. See variables sheet C2 - C16
						$scope.pb_data = passengersBoardedData;

						/**
						 * View state
						 *
						 * Stores the state of collapsed sections, collapsed = true|false.
						 *
						 * @type {*|Array|Choice|Undefined|Object|array|promise|Object}
						 */
						$scope.active_tab = localStorageService.get('active_tab');
						$scope.activeTab = function () {
							localStorageService.set('active_tab', $scope.active_tab);
						};

						/**
						 * View state
						 *
						 * Initiates the process for saving the open results view, Charts or table.
						 *
						 * NOTE: This is currently broken
						 *
						 * @type {*|Array|Choice|Undefined|Object|array|promise|Object}
						 */
						if ( localStorageService.get('results_view') ) {
							// $state.go(localStorageService.get('results_view').name);
						} else {
							// $state.go('calculator.chart_high');
						}

						/**
						 * View state
						 *
						 * Saves the state of the open results view, Charts or table,
						 * when loaded. Uses state and state change success event ($stateChangeSuccess).
						 */
						$scope.$on('$stateChangeSuccess',
								function (event, toState, toParams, fromState, fromParams) {
									// Store state of view in localstorage
									localStorageService.set('results_view', toState);
									$scope.resultsView = toState.name;
									// update chart
									$scope.updateData();
								});

						/**
						 * Get the defaults values from inputData Factory
						 *
						 * @type {cal|*|$scope.cal}
						 */
						$scope.input = inputData;

						/**
						 * Watch inputs on calculator
						 *
						 * Watches inputData factory, if any changes detected then
						 * call updateData() to update allData factory.
						 */
						$scope.$watch(function () {
									return inputData;
								},
								function (newVal, oldVal) {
									$scope.updateData();
								}, true);

					}])

		.controller('AuthCtrl', ['$rootScope', '$scope', '$state', '$firebase', '$firebaseSimpleLogin', 'Authorisation',
			function ($rootScope, $scope, $state, $firebase, $firebaseSimpleLogin, Authorisation) {

                Authorisation.loginObj.$getCurrentUser().then(
						function (user) {
							$scope.user_forms_ready = true;
							if ( user === null ) {
								$scope.$emit('isLoggedInMessage', false);
                                $scope.logged_in = false;
							} else {
								$scope.$emit('isLoggedInMessage', true);
                                $scope.user = user;
                                $scope.logged_in = true;
							}
						}
				);

				$scope.loginUser = function () {

					// Check form valid completed
					if ( $scope.login.$valid ) {

						$scope.show_loader = true;

                        Authorisation.loginObj.$login("password", {
									email : $scope.auth.email,
									password : $scope.auth.password
								}

						).then(function (user) {

									// User is now logged in
                                    $scope.logged_in = true;

									// Emit logged in message
									$scope.$emit('isLoggedInMessage', true);

									// Hide button loader icon
									//$scope.show_loader = false;

									// Messaging
									//$scope.message = "You are logged in.";
									//$scope.reason = "Welcome, " + user.email;

									// Redirect to info screen
									$state.go('info');

								}, function (error) {

									// Hide button loader icon
									$scope.show_loader = false;

									// Messaging
									$scope.message = "Login failed";

									// Get error codes and print relevent message
									switch (error.code) {
										case "INVALID_EMAIL" :
											$scope.reason = "The specified email address is incorrect.";
											break;
										case "INVALID_USER" :
											$scope.reason = "The specified user does not exist.";
											break;
										case "INVALID_PASSWORD" :
											$scope.reason = "The specified password is incorrect";
											break;
										case "UNKNOWN_ERROR" :
											$scope.reason = "An unknown error occurred. Please contact support@firebase.com.";
											break;
										case "USER_DENIED" :
											$scope.reason = "User denied authentication request.";
											break;
									}
								});
					}
				};

				$scope.logoutUser = function () {
                    $scope.logged_in = false;
					$scope.$emit('isLoggedInMessage', false);
					$scope.message = "";
                    Authorisation.loginObj.$logout();
				};

				$scope.sendPassword = function () {
					$scope.show_loader = true;
					if ( $scope.password.$valid ) {
                        Authorisation.loginObj.$sendPasswordResetEmail($scope.auth.email).then(
								function () {
									$scope.message = true;
									$scope.show_loader = false;
								}
						)
					}
				};

				$scope.resetPassword = function () {
					$scope.show_loader = true;
					if ( $scope.reset.$valid ) {
                        Authorisation.loginObj.$changePassword($scope.auth.email, $scope.auth.old_password, $scope.auth.new_password).then(
								function () {
									$scope.message = true;
									$scope.show_loader = false;
								}
						)
					}
				};
			}
		]);