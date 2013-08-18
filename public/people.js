
var tromb = angular.module('tromb', []);

tromb.controller('PeopleCtrl', function($scope, $http) {

	$scope.features = {
		mozActivity: false,
		fileApi: false
	};

	$scope.people = []; //Array of people
	$scope.person = {}; //Store form data

	//
	// Check feature support
	//
	if (!window.CanvasRenderingContext2D) {
		//catch if HTML5 canvas 2D not supported
	}
	else if (typeof MozActivity !== 'undefined') {
		$scope.features.mozActivity = true;
	}
	else if (window.File && window.FileReader && window.FileList && window.Blob) {
		$scope.features.fileApi = true;
	}

	$scope.fetchList = function() {
		$scope.message = 'Fetching list of people from server...';

		$http({
			method: 'GET',
			url: 'trombine/list'
		})
		.success(function(data, status) {
			$scope.people = data;
			$scope.message = undefined;

			/*var container = document.querySelector('.tiles'); // should use Angular directive
			var activateMasonry = function() {
				var msnry = new Masonry( container, {
				  itemSelector: '.tile' // should use Angular directive
				});
			};
			requestAnimationFrame(function() {
				requestAnimationFrame(activateMasonry);
			});*/
		})
		.error(function(data, status) {
			if (data)
				$scope.message = 'Error: ' + status + ' ' + data;
			else
				$scope.message = 'Failed to fetch list of people :-(';
		});
	};

	$scope.fetchList();

	$scope.addPerson = function() {
		$scope.message = 'Sending data to server...';

		var obj = $scope.person;

		$http({
			method: 'POST',
			url: 'trombine/new',
			data: obj
		})
		.success(function(data, status) {
			$scope.addPersonComplete(obj);
			$scope.message = undefined;
		})
		.error(function(data, status) {
			$scope.message = 'Error: ' + status + ' ' + data;
		});
	};

	$scope.addPersonComplete = function(obj) {
		// Add person to people collection
		$scope.people.push(obj);

		//Clear form
		$scope.person = {};

		// that's the easy way, not very optimal but does the job. Would be better to just create the new tile element
		// and insert it in the right spot (respect alphabetical sorting) in the DOM instead with the nice fadeIn or else
		$scope.fetchList();
	};

	$scope.pickPhoto = function (evt) {
		//
		// FirefoxOS
		//
		if ($scope.features.mozActivity) {
			var pick = new MozActivity({
				name: 'pick',
				data: {
					type: ['image/png', 'image/jpg', 'image/jpeg']
				}
			});

			pick.onsuccess = function () {
				var img = new Image();
				img.src = window.URL.createObjectURL(this.result.blob);
				img.onload = function() {
					var resized = resizeMe(this);
					$scope.person.photoBlob = resized;
					$scope.$apply();
				};

			};

			pick.onerror = function () {
				alert('Problem using the image, or no image was selected.');
			};
		}
		//
		// HTML5 FileAPI
		//
		else if ($scope.features.fileApi) {
			if (evt.files.length == 0) {
				alert('No file was selected?');
				return;
			}
			else if (evt.files.length > 1) {
				alert('Please only select one file.');
				return;
			}

			for (var i = 0, f; f = evt.files[i]; i++) {
				if ((/image/i).test(f.type)) {
					var img = new Image();
					img.onload = function() {
						var resized = resizeMe(this);
						$scope.person.photoBlob = resized;
						$scope.$apply();
					}

					var reader = new FileReader();
					reader.onload = (function(theFile) {
						return function(e) {
							theFile.src = e.target.result;
						};
					})(img);
					reader.readAsDataURL(f);
				}
			}
		}
		else {
			alert('Your browser isn\'t supported.');
		}
	};
});




function resizeMe(img) {

	var canvas = document.createElement('canvas');

	var width = img.width;
	var height = img.height;
	var max_width = 200;
	var max_height = 400;

	// calculate the width and height, constraining the proportions
	if (width > height) {
		if (width > max_width) {
			height = Math.round(height *= max_width / width);
			width = max_width;
		}
	} else {
		if (height > max_height) {
			width = Math.round(width *= max_height / height);
			height = max_height;
		}
	}

	// resize the canvas and draw the image data into it
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);

	return canvas.toDataURL("image/jpeg",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}
