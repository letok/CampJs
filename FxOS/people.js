console.log('hello');

function PeopleCtrl($scope) {
	$scope.people = [
		{ name: 'Bob', occupation: 'Web dev', company: 'Comp1', twitterHandle: 'Bob111' },
		{ name: 'John', occupation: 'Web dev', company: 'Comp2', twitterHandle: 'JohnXXX' }
	];

	$scope.addPerson = function() {
		console.log($scope.people[0].name);
		$scope.people.push({
				name: $scope.name,
				occupation: $scope.occupation,
				company: $scope.company,
				twitterHandle: $scope.twitterHandle,
				photo: $scope.photo
		});
		$scope.name = '';
	};

	$scope.pickPhoto = function () {
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
			$scope.name = 'Ok';
			$scope.$apply();
		};

		pick.onerror = function () { 
			alert("Can't view the image!");
		};
	};
};
