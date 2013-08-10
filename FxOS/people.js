
var tromb = angular.module('tromb', []);

tromb.controller('PeopleCtrl', function($scope) {
	$scope.people = [
		{ name: 'Bob', occupation: 'Web dev', company: 'Comp1', twitterHandle: 'Bob111', photo: "blob:b21ed2f5-e600-414a-91c1-53f68169f031" },
		{ name: 'John', occupation: 'Web dev', company: 'Comp2', twitterHandle: 'JohnXXX', photo: "blob:eb1b20d8-c2fa-2e46-9e50-7f143bb362c6" }
	];

	$scope.addPerson = function() {
		$scope.addPersonComplete();
		return;

		var form = new FormData();
		form.append('name', $scope.name);
		form.append('occupation', $scope.occupation);
		form.append('company', $scope.company);
		form.append('twitter', $scope.twitterHandle);
		form.append('photoBlob',  $scope.photoBlob);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'getfile.php');
		xhr.send(form);

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					$scope.addPersonComplete();
				}
				else {
					alert('Failed...');
				}
			}
		};
	};

	$scope.addPersonComplete = function() {
		// Add person to people collection
		$scope.people.push({
			name: $scope.name,
			occupation: $scope.occupation,
			company: $scope.company,
			twitterHandle: $scope.twitterHandle,
			photo: $scope.photo
		});

		//Clear form
		$scope.name = '';
		$scope.occupation = '';
		$scope.company = '';
		$scope.twitterHandle = '';
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

			console.log(window.URL.createObjectURL(this.result.blob));

			console.log($scope.people[0].name);
			$scope.photo = window.URL.createObjectURL(this.result.blob);
			$scope.photoBlob = this.result.blob;
			//$scope.name = 'Ok';
			$scope.$apply();
		};

		pick.onerror = function () { 
			alert("Can't view the image!");
		};
	};
});
