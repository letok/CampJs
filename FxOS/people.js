
var tromb = angular.module('tromb', []);

tromb.controller('PeopleCtrl', function($scope, $http) {
	//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

	$scope.people = [
		//{ name: 'Bob', occupation: 'Web dev', company: 'Comp1', twitter: 'Bob111', photo: "blob:b21ed2f5-e600-414a-91c1-53f68169f031" },
		//{ name: 'John', occupation: 'Web dev', company: 'Comp2', twitter: 'JohnXXX', photo: "blob:eb1b20d8-c2fa-2e46-9e50-7f143bb362c6" }
	];

	$scope.fetchList = function() {
		console.log('fetchList...');
		$scope.message = 'Fetching list of people...';

		$http({
			method: 'GET',
			url: 'http://192.168.88.203:3000/trombine/list'
		})
		.success(function(data, status) {
			console.log('... done');
			$scope.people = data;
			$scope.message = undefined;
		})
		.error(function(data, status) {
			console.log('... error');
			$scope.message = 'Error: ' + status + ' ' + data;
		});
	};

	$scope.fetchList();

	$scope.addPerson = function() {
		//$scope.addPersonComplete();
		//window.btoa($scope.photoBlob);
		//console.log('nope');
		//return;

		var obj = {
			name: $scope.name,
			occupation: $scope.occupation,
			company: $scope.company,
			twitter: $scope.twitter,
			photo: $scope.photo,
			photoBlob: $scope.photoBlob
		};

		console.log(obj);

		$http({
			method: 'POST',
			url: 'http://192.168.88.203:3000/trombine/new',
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: obj
		})
		.success(function(data, status) {
			console.log('post success');
			$scope.addPersonComplete(obj);
		})
		.error(function(data, status) {
			console.log('post error');
			alert('Error: ' + status + ' ' + data);
		});

/*
		var form = new FormData();
		form.append('name', $scope.name);
		form.append('occupation', $scope.occupation);
		form.append('company', $scope.company);
		form.append('twitter', $scope.twitter);
		form.append('photoBlob',  $scope.photoBlob);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://192.168.88.203:3000/trombine/new');
		xhr.send(form);

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					$scope.addPersonComplete();
				}
				else {
					alert('Failed ' + xhr.status + ' ' + xhr.responseText);
				}
			}
		};*/
	};

	$scope.addPersonComplete = function(obj) {
		// Add person to people collection
		$scope.people.push(obj);

		//Clear form
		$scope.name = '';
		$scope.occupation = '';
		$scope.company = '';
		$scope.twitter = '';
		$scope.photo = '';
		$scope.photoBlob = '';
		//$scope.$setPristine();
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
			console.log('onsuccess');

			//var img = document.createElement("img");
			//img.src = window.URL.createObjectURL(this.result.blob);
			//var imagePresenter = document.querySelector("body");
			//imagePresenter.appendChild(img);

			console.log($scope.people[0].name);
			$scope.photo = window.URL.createObjectURL(this.result.blob);

			var img = new Image();
			img.src = $scope.photo;
			img.onload = function() {
				var resized = resizeMe(img);
				//console.log(resized);
				$scope.photoBlob = resized;
				$scope.$apply();
			};

			//var reader = new FileReader();
			//reader.readAsDataURL(this.result.blob);
			//reader.onload = function(event) {
				//console.log(event.target.result);
				//$scope.photoBlob = event.target.result;
			//	$scope.$apply();
			//};
			//console.log(window.btoa(this.result.blob));

			//$scope.photoBlob = window.btoa(this.result.blob);
			//$scope.name = 'Ok';
			//$scope.$apply();
		};

		pick.onerror = function () { 
			alert("Can't view the image!");
		};
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
      //height *= max_width / width;
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      //width *= max_height / height;
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  
  // resize the canvas and draw the image data into it
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  
  //preview.appendChild(canvas); // do the actual resized preview
  
  return canvas.toDataURL("image/jpeg",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}
