angular.module('starter.services', ['firebase'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
      id: 0,
      name: 'John Smith',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Aaron Hamm',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Rhunthar Shelkyi',
      lastText: 'I should buy a boat',
      face: 'img/mike.png'
    }, {
      id: 3,
      name: 'Jeremy Obawa',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    },
    //{
    //   id: 4,
    //   name: 'Mike Harrington',
    //   lastText: 'This is wicked good ice cream.',
    //   face: 'img/mike.png'
    // }
  ];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})


//factory basically reads all of the database
.factory('FriendsList', ['$firebaseObject', function($firebaseObject) {
  var config = {
    apiKey: "AIzaSyDy2C7FL8Og1Y5uv7uXNwCdLJ3A--N2Q5I",
    authDomain: "hello-world-d3d4b.firebaseapp.com",
    databaseURL: "https://hello-world-d3d4b.firebaseio.com",
    storageBucket: "hello-world-d3d4b.appspot.com",
    messagingSenderId: "173423188623"
  };
  firebase.initializeApp(config);

  //main reference to the database through which everything else can be accessed
  var ref = firebase.database().ref();

  var _af = $firebaseObject(ref);
  //in this case I'm returning the whole database
  //with this, the whole factory essentially becomes the database

  var contacts = [];

  // Go through the database reference and retrieve every child.
  // Then make a firebase object using that child and store it in an array.
  // The array is then returned using the "all" function further down
  ref.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

        //key below now stores the keys of the database. First one is contact1
        var key = childSnapshot.key;

        var reffChild = ref.child(key);
        var reffObj = $firebaseObject(reffChild);
        contacts.push(reffObj);

      });
    });

  return {
    get: function() {

      // BELOW: test the performance in terms of MS (milliseconds)
      //        of how fast is the whole database retrieved from the firebase
      // if (!_af) {
      //   // Simple index lookup
      //   var start = Date.now();
      //   _af = $firebaseObject(ref);
      //
      //   _af.$loaded().then(function() {
      //     var finish = Date.now();
      //     var duration = finish - start;
      //
      //     console.log('loading data took ' + duration + 'ms');
      //   });
      // }

      return _af;
    },

    all: function() {
      return contacts;
    },

    getChild: function(friendID) {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].$id === friendID) {

          return contacts[i];
        }
      }
      return null;

    }


    // retrieve: function(){
    //   for (var key in _af){
    //     if(_af.hasOwnProperty(key)){
    //       return _af(key);
    //     }
    //   }
    //   console.log("Contact Not Found");
    //   return null;
    // }
  };
}]);
