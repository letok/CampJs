
var tromb = angular.module('tromb', []);

tromb.controller('PeopleCtrl', function($scope, $http) {

	$scope.features = {
		mozActivity: false,
		fileApi: false
	};

	$scope.people = [];

	// Check feature support
	if (typeof MozActivity !== 'undefined') {
		$scope.features.mozActivity = true;
	}
	else if (window.File && window.FileReader && window.FileList && window.Blob) {
		$scope.features.fileApi = true;
	}

	$scope.fetchList = function() {
		$scope.message = 'Fetching list of people...';

		$http({
			method: 'GET',
			url: 'trombine/list'
		})
		.success(function(data, status) {
			$scope.people = data;
			$scope.message = undefined;

			var container = document.querySelector('.tiles');
			var activateMasonry = function() {
				var msnry = new Masonry( container, {
				  itemSelector: '.tile'
				});
			};
			requestAnimationFrame(function() {
				requestAnimationFrame(activateMasonry);
			});
		})
		.error(function(data, status) {
			$scope.message = 'Error: ' + status + ' ' + data;
		});
	};

	$scope.fetchList();

	$scope.addPerson = function() {
		var obj = {
			name: $scope.name,
			occupation: $scope.occupation,
			company: $scope.company,
			twitter: $scope.twitter,
			photoBlob: $scope.photoBlob
		};

		$http({
			method: 'POST',
			url: 'trombine/new',
			data: obj
		})
		.success(function(data, status) {
			$scope.addPersonComplete(obj);
		})
		.error(function(data, status) {
			alert('Error: ' + status + ' ' + data);
		});
	};

	$scope.addPersonComplete = function(obj) {
		// Add person to people collection
		$scope.people.unshift(obj);

		//Clear form
		$scope.name = '';
		$scope.occupation = '';
		$scope.company = '';
		$scope.twitter = '';
		$scope.photoBlob = '';
	};

	$scope.pickPhoto = function () {
		if (typeof MozActivity === 'undefined') {
			alert('Not implemented...');
			return;
		}

		var pick = new MozActivity({
			name: "pick",
			data: {
				type: ["image/png", "image/jpg", "image/jpeg"]
			}
		});

		pick.onsuccess = function () {

			var img = new Image();
			img.src = window.URL.createObjectURL(this.result.blob);
			img.onload = function() {
				var resized = resizeMe(img);
				$scope.photoBlob = resized;
				$scope.$apply();
			};

		};

		pick.onerror = function () {
			alert("Can't view the image!");
		};
	};

	$scope.fileChanged = function(evt) {

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
					var resized = resizeMe(img);
					$scope.photoBlob = resized;
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
	};
});




function resizeMe(img) {

	var canvas = document.createElement('canvas');

	var width = img.width;
	var height = img.height;
	var max_width = 200;
	var max_height = 200;

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
