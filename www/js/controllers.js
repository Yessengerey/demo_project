angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})


// current chat's data
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

// factory gets passed through the main app.js module
//the factory gets passed to the controllers behind the scenes
.controller('FriendsCtrl', function($scope, FriendsList) {
  //$scope allows you to access functions and variables outside of the js files
  //$scope.all_friends = FriendsList.get();
  $scope.contact_list = FriendsList.all();


  // Convert time from Epoch to UTC and format it into a form of "2 June 2016"
  var all_months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September",
    "October", "November", "December"
  ];

  $scope.convertTime = function(timedate) {
    var t = new Date(timedate);

    var day = t.getDate();
    var monthIndex = t.getUTCMonth();
    var year = t.getUTCFullYear();

    var month = all_months[monthIndex];

    var full_date = day + " " + month + " " + year;
    return full_date;
  };
  // END OF TIME CONVERT code block
})



/* Variables and functions decalred with $scope can be called from within html (templates)
   files through corresponding controllers */
/* $stateParams allow you to access variables that have been "declared" in the states
   of the factory in this way e.g.: /tabs/:example_var */
.controller('ProfileCtrl', function($scope, $stateParams, FriendsList, $ionicActionSheet, $http) {
    $scope.aFriend = FriendsList.getChild($stateParams.friendID);
    $scope.splitName = $scope.aFriend.fullName.split(" ");

    //  var children = $scope.aFriend.interests;
    //
    $scope.all_ints = [];
    //
    //   var insertData = function(){
    //     for(var i = 0; i < children.length; i++){
    //       $scope.all_ints.push(children[i]);
    //     }
    //   }();
    $scope.all_ints[0] = $scope.aFriend.interests.interest1;
    $scope.all_ints[1] = $scope.aFriend.interests.interest2;
    $scope.all_ints[2] = $scope.aFriend.interests.interest3;

    $scope.all_ints.sort();
    $scope.show = function() {
      var actionSheet = $ionicActionSheet.show({
        buttons: [{
          text: '<b>Take Photo</b>'
        }, {
          text: 'Choose from Gallery'
        }],
        destructiveText: 'Remove',
        titleText: 'Change Photo',
        cancelText: 'Cancel',
        cancel: function() {
          //cancellation code here
        },
        buttonClicked: function(index) {
          return true;
        }
      });
    };

    //$scope.myData = Clt2Service.getInfo();
    $scope.getSomething = function(){
      $http({
        method: 'GET',
        url: 'https://boiling-bayou-95965.herokuapp.com/get'
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available

        $scope.foo = response.data.foo;
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.

        //$scope.foo = "NOPE";
      });
    };

  //   document.addEventListener("deviceready", function () {
  //
  //   var options = {
  //     quality: 50,
  //     destinationType: Camera.DestinationType.DATA_URL,
  //     sourceType: Camera.PictureSourceType.CAMERA,
  //     allowEdit: true,
  //     encodingType: Camera.EncodingType.JPEG,
  //     targetWidth: 100,
  //     targetHeight: 100,
  //     popoverOptions: CameraPopoverOptions,
  //     saveToPhotoAlbum: false,
	//   correctOrientation:true
  //   };
  //
  //   $cordovaCamera.getPicture(options).then(function(imageData) {
  //     var image = document.getElementById('profilePic');
  //     image.src = "data:image/jpeg;base64," + imageData;
  //   }, function(err) {
  //     // error
  //   });
  //
  // }, false);
});
