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
.controller('ProfileCtrl', function($scope, $stateParams, FriendsList, $ionicActionSheet, $http, $cordovaCamera) {

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  var storageRef = firebase.storage().ref('images/' + guid() + '.jpg');

  $scope.imageU = "";

  $scope.aFriend = FriendsList.getChild($stateParams.friendID);
  $scope.splitName = $scope.aFriend.fullName.split(" ");
  $scope.all_ints = [];
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
        if (index === 0) {
          document.addEventListener("deviceready", function() {
            var options_camera = {
              quality: 100,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 100,
              targetHeight: 100,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };
            storageRef.putString(imageData, 'base64').then(function(snapshot){
              firebase.database().ref().child($stateParams.friendID).update({
                imageU: snapshot.downloadURL
              }).then(function(){
                alert('updated');
              }).catch(function(error){
                alert(JSON.stringify(error));
              });
            }).catch(function(error){
              alert(JSON.stringify(error));
            });

          }, false);
        } else if (index === 1) {
          document.addEventListener("deviceready", function() {
            var options_camera = {
              quality: 100,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 100,
              targetHeight: 100,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };
            $cordovaCamera.getPicture(options_camera).then(function(imageData) {

              // putString lets you upload a raw base64 or base64url encoded string to firebase
              // If the upload is successful 'then' snapshot is returned containing data on that image
              /* Using the ref() [reference] to a firebase, we access a child of the firebase via the
              firendID that was saved in the $stateParams and then 'update' that child with a new
              attribute imageU with a value of the image's url. This way the image is linked to that
              particular contact */

              storageRef.putString(imageData, 'base64').then(function(snapshot){
                firebase.database().ref().child($stateParams.friendID).update({
                  imageU: snapshot.downloadURL
                }).then(function(){
                  alert('updated');
                }).catch(function(error){
                  alert(JSON.stringify(error));
                });
              }).catch(function(error){
                alert(JSON.stringify(error));
              });

            }, function(err) {
              // error
            });

          }, false);




        }
        return true;

      }
    });
  };

  // The method below sends a friendID as part of the URL and retrieves the image at the same time
  // HTTP GET method with the url path to the required information
  $scope.getSomething = function() {
    $http({
      method: 'GET',
      url: 'https://boiling-bayou-95965.herokuapp.com/contacts/' + $stateParams.friendID
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      // Upon success, retrieve the data stored in the response which essentially is the json object
      $scope.foo = response.data;

    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.

      //$scope.foo = "NOPE";
    });
  };
});
